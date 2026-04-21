import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BehindTheGlowTeaser() {
  return (
    <section id="behind-the-glow" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-br from-cream via-white to-latte/30">
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <Link
            href="/behind-the-glow"
            className="group flex flex-col md:flex-row items-stretch bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/10 transition-all duration-500"
          >
            {/* Imagery */}
            <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[18rem]">
              <Image
                src="/images/skincare-products.jpg"
                alt="Curated skincare products"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-champagne/20 via-transparent to-rose/20" />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne" />
                </span>
                <span className="text-espresso text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Copy */}
            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
              <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-3 inline-flex items-center gap-2">
                <Sparkles size={14} aria-hidden="true" />
                The Skin Cafe Journal
              </span>
              <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-espresso mb-3 leading-[1.1]">
                Behind the <span className="gradient-text">Glow</span>
              </h2>
              <p className="text-mocha/70 text-base leading-relaxed mb-6 max-w-xl">
                A journal of skin tips, brand spotlights, and self-care
                wisdom from licensed aestheticians with decades of experience.
                Launching soon — get the full story and reserve your spot.
              </p>
              <span className="inline-flex items-center gap-2 text-espresso font-semibold group-hover:text-champagne transition-colors">
                Learn more &amp; subscribe
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
