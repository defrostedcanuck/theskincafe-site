'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeEmail } from '@/app/actions/subscribe';
import type { FormState } from '@/app/actions/types';
import ScrollReveal from './ScrollReveal';
import { Sparkles, CheckCircle } from 'lucide-react';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shimmer bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-champagne/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {pending ? 'Subscribing…' : 'Notify Me'}
    </button>
  );
}

export default function BehindTheGlow() {
  const [state, formAction] = useActionState(subscribeEmail, initialState);

  return (
    <section id="behind-the-glow" className="py-24 sm:py-32 bg-cream relative">
      {/* Decorative blurs — match About.tsx vocabulary */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose/5 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <ScrollReveal>
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 inline-flex items-center gap-2">
            <Sparkles size={14} aria-hidden="true" />
            Coming Soon
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mt-4 mb-4">
            Behind the <span className="gradient-text">Glow</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 mb-8 max-w-xl mx-auto leading-relaxed">
            Decades of skin, beauty, and self-care expertise — written for you.
            Be the first to read when we launch.
          </p>

          {state.success ? (
            <div
              role="status"
              className="animate-scale-in inline-flex items-center gap-2 bg-sage/20 text-espresso px-6 py-4 rounded-full"
            >
              <CheckCircle className="text-sage" size={20} aria-hidden="true" />
              <span className="font-medium">{state.message}</span>
            </div>
          ) : (
            <form
              action={formAction}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              noValidate
            >
              <label htmlFor="behind-the-glow-email" className="sr-only">
                Email address
              </label>
              <input
                id="behind-the-glow-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-full bg-white border border-latte text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
              />
              <SubmitButton />
            </form>
          )}

          {state.error && (
            <p className="text-rose text-sm mt-4" role="alert">
              {state.error}
            </p>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
