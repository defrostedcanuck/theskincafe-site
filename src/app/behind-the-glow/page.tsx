import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "../components/Navbar";
import BehindTheGlow from "../components/BehindTheGlow";
import BookingCTA from "../components/BookingCTA";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";
import ScrollReveal from "../components/ScrollReveal";
import { Sparkles, BookOpen, Tag, Bell, Heart, Feather } from "lucide-react";

export const metadata: Metadata = {
  title: "Behind the Glow — The Skin Cafe Journal",
  description:
    "A forthcoming journal of skincare tips, brand spotlights, and self-care wisdom from The Skin Cafe's licensed aestheticians. Launching soon — subscribe for early access.",
  alternates: { canonical: "/behind-the-glow" },
};

const pillars = [
  {
    icon: BookOpen,
    title: "Tips of the week",
    body: "Short, practical things you can do this week — seasonal reminders, ingredient explainers, and the small habits that actually move the needle on your skin.",
  },
  {
    icon: Tag,
    title: "Brand + product spotlights",
    body: "Honest looks at the brands we stock and why. We only carry what we'd use ourselves — and we'll show you how to use it at home between visits.",
  },
  {
    icon: Sparkles,
    title: "Procedures explained",
    body: "Deep dives on the treatments you've been curious about — who they're for, what to expect, what the aftercare looks like, and how long results last.",
  },
  {
    icon: Bell,
    title: "First access",
    body: "Subscribers hear about new treatments, seasonal offers, and booking windows before anyone else. No overwhelming, just the occasional 'you'd want to know'.",
  },
  {
    icon: Heart,
    title: "Self-care reminders",
    body: "Gentle nudges to actually book the thing on your calendar. We believe beauty work is self-care — not vanity — and we'll treat it that way.",
  },
  {
    icon: Feather,
    title: "Stories from the chair",
    body: "Decades of experience means thousands of stories. Expect the occasional quiet reflection from the artists behind the work.",
  },
];

export default function BehindTheGlowPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero — reuse the magazine split */}
        <BehindTheGlow />

        {/* Pillars */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 block">
                What to Expect
              </span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso mb-5 leading-[1.1]">
                Six kinds of posts, one <span className="gradient-text">voice</span>
              </h2>
              <div className="section-divider mx-auto mb-6" />
              <p className="text-mocha/70 text-lg leading-relaxed">
                Behind the Glow is written by the same people who sit across
                from you in the treatment room. Here's what we'll be publishing.
              </p>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 80}>
                  <div className="h-full bg-cream/60 rounded-2xl p-8 hover:bg-cream transition-colors border border-latte/50">
                    <span className="flex-shrink-0 w-12 h-12 rounded-full bg-champagne/15 flex items-center justify-center text-champagne mb-4">
                      <p.icon size={20} aria-hidden="true" />
                    </span>
                    <h3 className="font-[var(--font-display)] text-xl font-semibold text-espresso mb-2 leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-mocha/70 text-sm leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Voice / trust section */}
        <section className="py-20 sm:py-28 bg-gradient-to-br from-espresso via-espresso to-mocha text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(201,169,110,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(183,110,121,0.1),transparent_50%)]" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <ScrollReveal>
              <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 inline-block">
                Who Writes It
              </span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-[1.1]">
                Written by the team who treats you
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Tamara, Dr. Hooker, Chelsea, Starr, Cydnii, Kathy, Olivia — the
                same licensed specialists you book with are the ones at the
                keyboard. No outsourced content. No generic "10 tips" listicles.
              </p>
              <p className="text-white/60 text-base leading-relaxed max-w-2xl mx-auto">
                We publish when we have something to say. That means no daily
                newsletters, no spam, and every post earns its place in your
                inbox.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA — imagery + reinforcement */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl shadow-espresso/15">
                  <Image
                    src="/images/treatment-led.jpg"
                    alt="LED treatment in progress at The Skin Cafe"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-espresso mb-4 leading-[1.1]">
                    Be among the first readers
                  </h2>
                  <p className="text-mocha/70 text-lg leading-relaxed mb-6">
                    Drop your email on the form above and we'll send you the
                    very first issue when Behind the Glow launches — no sooner,
                    no later, no spam in between.
                  </p>
                  <a
                    href="#behind-the-glow"
                    className="btn-shimmer inline-flex items-center gap-2 bg-gradient-to-r from-champagne to-champagne-dark text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-champagne/30 hover:-translate-y-0.5 transition-all"
                  >
                    Back to the signup
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <BookingCTA />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
