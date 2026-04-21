'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeEmail } from '@/app/actions/subscribe';
import type { FormState } from '@/app/actions/types';
import ScrollReveal from './ScrollReveal';
import { Sparkles, CheckCircle, BookOpen, Tag, Bell } from 'lucide-react';

const initialState: FormState = {};

const benefits = [
  {
    icon: BookOpen,
    title: 'Weekly insights',
    body: 'Tips from licensed aestheticians with decades of experience — written in plain language.',
  },
  {
    icon: Tag,
    title: 'Brand + product spotlights',
    body: 'What we stock, how to use it at home, and why it actually works.',
  },
  {
    icon: Bell,
    title: 'Early access',
    body: 'First to know about new treatments, seasonal offers, and self-care reminders.',
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-shimmer bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-champagne/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap"
    >
      {pending ? 'Subscribing…' : 'Notify Me'}
    </button>
  );
}

export default function BehindTheGlow() {
  const [state, formAction] = useActionState(subscribeEmail, initialState);

  return (
    <section
      id="behind-the-glow"
      className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-br from-cream via-white to-latte/30"
    >
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-rose/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Imagery column */}
          <ScrollReveal className="relative order-1 lg:order-1">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none">
              {/* Primary image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-espresso/20">
                <Image
                  src="/images/skincare-products.jpg"
                  alt="Curated skincare products on a soft marble surface"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
                {/* Warm overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent" />
              </div>

              {/* Offset accent tile */}
              <div className="absolute -bottom-8 -right-6 sm:-right-10 w-40 sm:w-52 aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-espresso/30 ring-8 ring-cream hidden sm:block">
                <Image
                  src="/images/treatment-facial-mask.jpg"
                  alt="Close-up of an in-treatment facial mask"
                  fill
                  sizes="(max-width: 1024px) 30vw, 15vw"
                  className="object-cover"
                />
              </div>

              {/* "Coming Soon" ribbon */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg shadow-espresso/10 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne" />
                </span>
                <span className="text-espresso text-xs font-semibold uppercase tracking-[0.2em]">
                  Coming Soon
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Content column */}
          <ScrollReveal className="order-2 lg:order-2">
            <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 inline-flex items-center gap-2">
              <Sparkles size={14} aria-hidden="true" />
              The Skin Cafe Journal
            </span>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-5 leading-[1.1]">
              Behind the <span className="gradient-text">Glow</span>
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-mocha/70 text-lg leading-relaxed mb-10 max-w-xl">
              Decades of skin, beauty, and self-care expertise — in a journal written
              for the people who sit in our chairs. Be the first to read when we launch.
            </p>

            {/* Benefit list */}
            <ul className="space-y-5 mb-10">
              {benefits.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex-shrink-0 w-11 h-11 rounded-full bg-champagne/15 flex items-center justify-center text-champagne">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-[var(--font-display)] text-espresso font-semibold text-lg leading-tight">
                      {title}
                    </span>
                    <span className="block text-mocha/65 text-sm leading-relaxed mt-1">
                      {body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Form */}
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
                className="flex flex-col sm:flex-row gap-3 max-w-lg"
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
                  className="flex-1 px-5 py-4 rounded-full bg-white border border-latte text-espresso placeholder:text-mocha/30 focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne transition-all"
                />
                <SubmitButton />
              </form>
            )}

            {state.error && (
              <p className="text-rose text-sm mt-4" role="alert">
                {state.error}
              </p>
            )}

            {!state.success && (
              <p className="text-mocha/50 text-xs mt-5 max-w-md">
                No spam, no sharing your address. Unsubscribe in one click. We
                publish thoughtfully, never daily.
              </p>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
