import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Team from "../components/Team";
import BookingCTA from "../components/BookingCTA";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";

export const metadata: Metadata = {
  title: "Meet Our Team | The Skin Cafe",
  description:
    "Licensed aestheticians, hair stylists, and medical director at The Skin Cafe — decades of combined experience across facials, lashes, brows, sugaring, and aesthetic medicine.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-24">
        <section className="relative bg-gradient-to-br from-cream via-white to-latte/30 py-16 sm:py-24 border-b border-latte/60 shadow-sm shadow-espresso/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 block">
              Our Artists
            </span>
            <h1 className="font-[var(--font-display)] text-4xl sm:text-6xl font-bold text-espresso mb-5 leading-[1.05]">
              Meet the <span className="gradient-text">Experts</span>
            </h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-mocha/70 text-lg leading-relaxed max-w-2xl mx-auto">
              The reason patrons drive across the Valley — and refer their
              sisters, mothers, and best friends. Every member of our team
              brings specialist certifications, an individual point of view,
              and a reputation built on extended, unhurried care.
            </p>
          </div>
        </section>
        <Team showHeader={false} />
        <BookingCTA />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
