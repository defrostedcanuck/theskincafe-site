'use server';

import { z } from 'zod';
import type { FormState } from './types';
import { resend } from '@/lib/resend';

// Zod schema is the single gate between untrusted form input and any side
// effect (Resend send). `safeParse` on an Object.fromEntries(formData) catches
// missing or malformed fields before an email goes out. Location + service are
// optional because the existing form UI allows the user to skip them.
const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  location: z.string().max(30).optional(),
  service: z.string().max(60).optional(),
  message: z.string().min(1).max(4000),
});

// Inline HTML escape — the Resend email body is assembled as an HTML string
// that staff renders in their email client. User input interpolated raw here
// is an XSS vector (RESEARCH.md Pitfall 7 + T-02-06). Keep this escape util
// colocated with the action so it's audit-visible at the call site.
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ]!),
  );

export async function submitContactForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check your entries and try again.',
    };
  }
  const { name, email, location, service, message } = parsed.data;

  const { error } = await resend.emails.send({
    // `from` MUST be on the verified subdomain `send.theskincafe.net` (Phase 1
    // verified only the subdomain — the apex is NOT authorized). See Pitfall 5.
    from: 'Contact Form <contact@send.theskincafe.net>',
    to: [process.env.STAFF_NOTIFICATION_EMAIL ?? ''],
    // replyTo points staff's "Reply" button at the submitter — the single
    // most useful piece of ergonomics for an internal contact-form notifier.
    replyTo: email,
    subject: `New contact: ${name}`,
    html: [
      `<h2>New contact form submission</h2>`,
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Location:</strong> ${escapeHtml(location ?? '—')}</p>`,
      `<p><strong>Service:</strong> ${escapeHtml(service ?? '—')}</p>`,
      `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    ].join(''),
  });

  if (error) {
    // Log the Resend error object ONLY (opaque/structured — no user PII).
    // Raw name/email/message never reach console.error. See T-02-08.
    console.error('[submitContactForm] Resend error', error);
    return {
      success: false,
      error:
        "We couldn't send your message right now. Please call us at (480) 619-0046.",
    };
  }

  return {
    success: true,
    message: "Thank you! We'll get back to you within 24 hours.",
  };
}
