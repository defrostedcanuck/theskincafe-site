import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the @/lib/resend singleton BEFORE importing the action-under-test.
// The action imports `resend` at module-top; the vi.mock factory replaces it
// with a stub whose `emails.send` is a spy we can assert against.
const sendMock = vi.fn();
vi.mock('@/lib/resend', () => ({
  resend: { emails: { send: sendMock } },
}));

beforeEach(() => {
  sendMock.mockReset();
  vi.stubEnv('STAFF_NOTIFICATION_EMAIL', 'staff@example.com');
});

// Helper: build a FormData from a plain object (matches what the Next.js
// runtime hands the server action at invocation time).
const fd = (obj: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
};

describe('submitContactForm', () => {
  it('sends on valid input with correct shape (from, to, replyTo, subject)', async () => {
    sendMock.mockResolvedValue({ error: null, data: { id: 'mock-id' } });
    const { submitContactForm } = await import('@/app/actions/contact');

    const result = await submitContactForm(
      {},
      fd({
        name: 'Jane Doe',
        email: 'jane@example.com',
        location: 'gilbert',
        service: 'facial',
        message: 'hi there',
      }),
    );

    expect(result.success).toBe(true);
    expect(result.message).toContain('24 hours');
    expect(sendMock).toHaveBeenCalledTimes(1);

    const call = sendMock.mock.calls[0][0];
    expect(call.from).toBe('Contact Form <contact@send.theskincafe.net>');
    expect(call.to).toEqual(['staff@example.com']);
    expect(call.replyTo).toBe('jane@example.com');
    expect(call.subject).toMatch(/^New contact: Jane Doe/);
    expect(call.html).toContain('hi there');
    expect(call.html).toContain('Jane Doe');
  });

  it('rejects missing email without calling Resend', async () => {
    const { submitContactForm } = await import('@/app/actions/contact');
    const result = await submitContactForm(
      {},
      fd({ name: 'Jane', message: 'hi' }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('check your entries');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects invalid email without calling Resend', async () => {
    const { submitContactForm } = await import('@/app/actions/contact');
    const result = await submitContactForm(
      {},
      fd({ name: 'Jane', email: 'not-an-email', message: 'hi' }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('check your entries');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('escapes HTML in message to prevent XSS in staff inbox', async () => {
    sendMock.mockResolvedValue({ error: null, data: { id: 'mock-id' } });
    const { submitContactForm } = await import('@/app/actions/contact');
    await submitContactForm(
      {},
      fd({
        name: 'Jane',
        email: 'j@e.com',
        message: '<script>alert(1)</script>',
      }),
    );
    const html = sendMock.mock.calls[0][0].html;
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  it('converts newlines to <br> in message html', async () => {
    sendMock.mockResolvedValue({ error: null, data: { id: 'mock-id' } });
    const { submitContactForm } = await import('@/app/actions/contact');
    await submitContactForm(
      {},
      fd({
        name: 'Jane',
        email: 'j@e.com',
        message: 'line one\nline two',
      }),
    );
    const html = sendMock.mock.calls[0][0].html;
    expect(html).toContain('line one<br>line two');
  });

  it('returns generic error with phone fallback and logs tag on Resend failure', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sendMock.mockResolvedValue({ error: { message: 'boom' }, data: null });
    const { submitContactForm } = await import('@/app/actions/contact');
    const result = await submitContactForm(
      {},
      fd({ name: 'Jane', email: 'j@e.com', message: 'hi' }),
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('(480) 619-0046');
    expect(errSpy).toHaveBeenCalledWith(
      '[submitContactForm] Resend error',
      expect.anything(),
    );
    errSpy.mockRestore();
  });

  it('does not log raw user input on failure (PII hygiene)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sendMock.mockResolvedValue({ error: { message: 'boom' }, data: null });
    const { submitContactForm } = await import('@/app/actions/contact');
    await submitContactForm(
      {},
      fd({
        name: 'SECRET_NAME',
        email: 'secret@example.com',
        message: 'SECRET_MSG',
      }),
    );
    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain('SECRET_NAME');
    expect(logged).not.toContain('secret@example.com');
    expect(logged).not.toContain('SECRET_MSG');
    errSpy.mockRestore();
  });
});
