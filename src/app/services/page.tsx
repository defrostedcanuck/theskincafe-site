import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import BookingCTA from "../components/BookingCTA";
import Footer from "../components/Footer";
import PromoBanner from "../components/PromoBanner";

export const metadata: Metadata = {
  title: "Services & Treatments | The Skin Cafe",
  description:
    "Explore the full menu of beauty, skincare, and aesthetic treatments offered at The Skin Cafe — facials, lashes, brows, waxing, massage, hair, and advanced aesthetic medicine.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-to-br from-cream via-white to-latte/30 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 block">
              Our Menu
            </span>
            <h1 className="font-[var(--font-display)] text-4xl sm:text-6xl font-bold text-espresso mb-5 leading-[1.05]">
              Services &amp; <span className="gradient-text">Treatments</span>
            </h1>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-mocha/70 text-lg leading-relaxed max-w-2xl mx-auto">
              Every service at The Skin Cafe is delivered by licensed
              specialists with decades of combined expertise — no scripts, no
              rushing, no one-size-fits-all treatment plans.
            </p>
          </div>
        </section>
        <Services />
        <BookingCTA />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
