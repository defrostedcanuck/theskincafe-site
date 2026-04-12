import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Heart, Award, Leaf } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Artistry & Care",
    description:
      "Every treatment is a bespoke experience. Our specialists take the time to understand your unique skin, your goals, and craft results that enhance your natural beauty.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description:
      "We use only premium, clinically-proven products and cutting-edge techniques. Our 4.9-star Google rating speaks to the transformations our clients experience.",
  },
  {
    icon: Leaf,
    title: "Holistic Wellness",
    description:
      "Beauty starts from within. Our approach combines skin health, relaxation, and self-care into a sanctuary experience that leaves you feeling renewed.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left content */}
          <ScrollReveal animation="slide-left">
            <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Our Story
            </span>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso leading-tight mb-6">
              Where Beauty Becomes
              <span className="gradient-text block">an Experience</span>
            </h2>
            <div className="section-divider mb-6" />
            <p className="text-mocha/80 leading-relaxed mb-4">
              The Skin Cafe was born from a simple belief: everyone deserves to feel
              beautiful, confident, and completely at ease. Founded by Tammy, a
              passionate aesthetician with over a decade of experience, we&apos;ve grown
              from a single treatment room into Arizona&apos;s most beloved beauty destination.
            </p>
            <p className="text-mocha/80 leading-relaxed mb-8">
              With two stunning locations in Gilbert and Scottsdale, our team of
              highly trained specialists delivers world-class facials, lash artistry,
              brow design, and body treatments — all in an atmosphere that feels like
              a retreat from the everyday.
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block font-[var(--font-display)] text-3xl font-bold gradient-text">
                  10+
                </span>
                <span className="text-xs text-mocha/60 uppercase tracking-wider">
                  Years
                </span>
              </div>
              <div className="h-10 w-px bg-latte" />
              <div className="text-center">
                <span className="block font-[var(--font-display)] text-3xl font-bold gradient-text">
                  2
                </span>
                <span className="text-xs text-mocha/60 uppercase tracking-wider">
                  Locations
                </span>
              </div>
              <div className="h-10 w-px bg-latte" />
              <div className="text-center">
                <span className="block font-[var(--font-display)] text-3xl font-bold gradient-text">
                  5K+
                </span>
                <span className="text-xs text-mocha/60 uppercase tracking-wider">
                  Clients
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right image */}
          <ScrollReveal animation="slide-right" delay={200}>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/about-spa.jpg"
                  alt="Luxury facial treatment at The Skin Cafe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent" />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl shadow-espresso/8 p-5 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                    <Leaf className="text-sage" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-espresso">Clean Products</p>
                    <p className="text-xs text-mocha/60">Premium & Proven</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Pillar cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 150}>
              <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-espresso/5 transition-all duration-500 hover:-translate-y-1 border border-latte/50">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-champagne/15 to-rose/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <pillar.icon className="text-champagne" size={24} />
                </div>
                <h3 className="font-[var(--font-display)] text-xl font-semibold text-espresso mb-3">
                  {pillar.title}
                </h3>
                <p className="text-mocha/70 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
