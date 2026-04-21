"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import ScrollReveal from "./ScrollReveal";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import type { FormState } from "@/app/actions/types";

const initialState: FormState = {};

// SubmitButton is a separate component specifically so `useFormStatus()` can
// read the pending state of the ancestor <form>. `useFormStatus` only works
// from within a child of the form element, which is the documented Next.js 16
// pattern (see node_modules/next/dist/docs/01-app/02-guides/forms.md).
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shimmer w-full bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-lg hover:shadow-champagne/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      <Send size={16} />
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export default function Contact() {
  // useActionState lives in `react` (NOT `react-dom`) in React 19. The old
  // react-dom `useFormState` is deprecated; see RESEARCH.md Pitfall 1.
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Get in Touch
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            We&apos;d Love to <span className="gradient-text">Hear From You</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <ScrollReveal animation="slide-left" className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-champagne" />
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">Phone</p>
                  <a
                    href="tel:4806190046"
                    className="text-mocha/70 hover:text-champagne transition-colors"
                  >
                    (480) 619-0046
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-champagne" />
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">Email</p>
                  <p className="text-mocha/70">info@theskincafe.net</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-champagne" />
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">Gilbert</p>
                  <p className="text-mocha/70 text-sm">
                    4100 S Lindsay Rd #121
                    <br />
                    Gilbert, AZ 85297
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-rose/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-rose" />
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">Scottsdale</p>
                  <p className="text-mocha/70 text-sm">
                    10333 N Scottsdale Rd, Unit 1
                    <br />
                    Scottsdale, AZ 85253
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-champagne/10 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-champagne" />
                </div>
                <div>
                  <p className="font-semibold text-espresso mb-1">Hours</p>
                  <p className="text-mocha/70 text-sm">
                    Mon-Thu: 10am-8pm
                    <br />
                    Fri: 9am-5pm &middot; Sat: 9am-6pm
                    <br />
                    Sun: 2pm-8pm
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal animation="slide-right" className="lg:col-span-3">
            <div className="bg-cream rounded-3xl p-8 sm:p-10">
              {state.success ? (
                <div className="text-center py-12 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-sage" />
                  </div>
                  <h3 className="font-[var(--font-display)] text-2xl font-bold text-espresso mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-mocha/70">
                    {state.message ??
                      "Thank you for reaching out. We'll get back to you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form action={formAction} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-espresso mb-2"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-latte text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-espresso mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-latte text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-espresso mb-2"
                    >
                      Preferred Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-latte text-espresso focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
                    >
                      <option value="">Select a location</option>
                      <option value="gilbert">Gilbert</option>
                      <option value="scottsdale">Scottsdale</option>
                      <option value="either">Either location</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-espresso mb-2"
                    >
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-latte text-espresso focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
                    >
                      <option value="">What are you interested in?</option>
                      <option value="facial">Facials & Skin Care</option>
                      <option value="lashes">Eyelash Extensions</option>
                      <option value="brows">Brow Services</option>
                      <option value="waxing">Waxing & Sugaring</option>
                      <option value="massage">Massage</option>
                      <option value="hair">Hair Services</option>
                      <option value="other">Other / General Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-espresso mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border border-latte text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all resize-none"
                      placeholder="Tell us about what you're looking for..."
                    />
                  </div>

                  <SubmitButton />

                  {state.error && (
                    <p
                      className="text-rose text-sm mt-2"
                      role="alert"
                    >
                      {state.error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
