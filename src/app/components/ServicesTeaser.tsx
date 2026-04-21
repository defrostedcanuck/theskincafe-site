import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight, Clock } from "lucide-react";

const featured = [
  {
    name: "The Perfect Peel",
    category: "Skin & Facials",
    description:
      "Our signature medical-grade peel that addresses fine lines, acne, and hyperpigmentation.",
    price: "$220",
    duration: "45 min",
    image: "/images/facial-treatment.jpg",
  },
  {
    name: "Classic Lash Extensions",
    category: "Lashes",
    description:
      "Natural-looking, one-to-one extensions applied to each lash. Lightweight and elegant.",
    price: "From $150",
    duration: "2 hrs",
    image: "/images/lash-extensions.jpg",
  },
  {
    name: "TrueBrow™ Design",
    category: "Brows",
    description:
      "Certified technique that reshapes and regrows brows naturally — no tattoo, no pencil.",
    price: "From $65",
    duration: "45 min",
    image: "/images/brows.jpg",
  },
  {
    name: "Brazilian Sugaring",
    category: "Body & Wax",
    description:
      "Gentle, all-natural sugar paste removal — less irritation, better results than traditional wax.",
    price: "From $65",
    duration: "30 min",
    image: "/images/waxing.jpg",
  },
];

export default function ServicesTeaser() {
  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <div className="absolute top-20 left-0 w-72 h-72 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-14">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Signature Services
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Our Most-Loved <span className="gradient-text">Treatments</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 max-w-2xl mx-auto">
            A small cross-section of what we do. The full menu runs longer —
            facials, peels, lashes, brows, waxing, massage, hair, and aesthetic
            medicine.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((svc, i) => (
            <ScrollReveal key={svc.name} delay={i * 100}>
              <Link
                href="/services"
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-espresso text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {svc.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-espresso mb-1.5 group-hover:text-champagne transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-mocha/65 text-sm leading-relaxed mb-4 line-clamp-2">
                    {svc.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-latte">
                    <span className="text-espresso font-semibold text-sm">
                      {svc.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-mocha/50 text-xs">
                      <Clock size={12} />
                      {svc.duration}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <Link
            href="/services"
            className="btn-shimmer inline-flex items-center gap-2 bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-champagne/30 hover:-translate-y-0.5 transition-all"
          >
            See the full menu
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
