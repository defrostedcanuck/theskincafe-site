"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import {
  Sparkles,
  Eye,
  Scissors,
  HandMetal,
  Flower2,
  Clock,
  ArrowRight,
} from "lucide-react";

const categories = [
  { id: "skin", label: "Skin & Facials", icon: Sparkles, image: "/images/facial-treatment.jpg" },
  { id: "lashes", label: "Lashes", icon: Eye, image: "/images/lash-extensions.jpg" },
  { id: "brows", label: "Brows", icon: Flower2, image: "/images/brows.jpg" },
  { id: "body", label: "Body & Wax", icon: HandMetal, image: "/images/massage.jpg" },
  { id: "hair", label: "Hair", icon: Scissors, image: "/images/hair-salon.jpg" },
];

interface Service {
  name: string;
  description: string;
  price: string;
  duration: string;
  popular?: boolean;
}

interface ServicesProps {
  /** Hide the internal section header (use when a page-level hero already provides title + intro). */
  showHeader?: boolean;
}

const services: Record<string, Service[]> = {
  skin: [
    {
      name: "The Perfect Peel",
      description:
        "Our signature medical-grade peel that addresses fine lines, acne, hyperpigmentation, and sun damage. Visible results in just one treatment.",
      price: "$220",
      duration: "45 min",
      popular: true,
    },
    {
      name: "Oxygen Facial",
      description:
        "Infuse pure oxygen and vitamins deep into the skin for an instant, radiant glow. Perfect before a special event.",
      price: "$90",
      duration: "1 hr 20 min",
    },
    {
      name: "Customized Facial",
      description:
        "Tailored to your skin's unique needs. Includes deep cleanse, exfoliation, extraction, mask, and targeted serums.",
      price: "$70",
      duration: "1 hr",
    },
    {
      name: "PCA Peel",
      description:
        "A gentle yet effective TCA peel ideal for sensitive, thin, or fragile skin. Therapeutic and restorative.",
      price: "$130",
      duration: "55 min",
    },
    {
      name: "Dermaplane",
      description:
        "Remove dead skin cells and fine vellus hair for a flawless, smooth canvas. Enhances product absorption.",
      price: "$90",
      duration: "1 hr",
    },
    {
      name: "Microdermabrasion",
      description:
        "Deep exfoliation to address fine lines and wrinkles. Six treatments recommended for optimal, lasting results.",
      price: "$90",
      duration: "55 min",
    },
  ],
  lashes: [
    {
      name: "Classic Full Set",
      description:
        "Natural-looking, one-to-one lash extensions applied to each natural lash. Lightweight and elegant.",
      price: "From $150",
      duration: "2 hrs",
      popular: true,
    },
    {
      name: "Volume Full Set",
      description:
        "Multiple ultra-fine extensions fanned onto each lash for a fuller, more dramatic look.",
      price: "From $200",
      duration: "2.5 hrs",
    },
    {
      name: "Lash Fill",
      description:
        "Maintain your gorgeous lashes with a refill every 2-3 weeks. Keeps your set looking fresh and full.",
      price: "From $65",
      duration: "1 hr",
    },
    {
      name: "Lash Lift & Tint",
      description:
        "A semi-permanent treatment that lifts and curls your natural lashes, enhanced with a rich tint.",
      price: "$75",
      duration: "1 hr",
    },
  ],
  brows: [
    {
      name: "TrueBrow\u2122 Design",
      description:
        "Our signature semi-permanent brow sculpting technique. Customized to your face shape for the most natural-looking brows.",
      price: "From $250",
      duration: "1.5 hrs",
      popular: true,
    },
    {
      name: "Brow Wax & Shape",
      description:
        "Expert shaping and sculpting using precision waxing to frame your face beautifully.",
      price: "$30",
      duration: "20 min",
    },
    {
      name: "Brow Tint",
      description:
        "Add depth and definition with a semi-permanent tint matched to your natural color.",
      price: "$25",
      duration: "15 min",
    },
  ],
  body: [
    {
      name: "Full Body Massage",
      description:
        "Melt away tension with a customized massage. Choose from Swedish, deep tissue, or aromatherapy.",
      price: "From $90",
      duration: "1 hr",
      popular: true,
    },
    {
      name: "Full Legs Wax",
      description:
        "Smooth, silky legs with our premium waxing technique. Minimizes irritation and ingrown hairs.",
      price: "$70",
      duration: "45 min",
    },
    {
      name: "Bikini Wax",
      description:
        "Clean, precise waxing for the bikini area. Available in standard and Brazilian styles.",
      price: "From $40",
      duration: "45 min",
    },
    {
      name: "Sugaring",
      description:
        "All-natural hair removal from brows to bikinis. Gentler on skin than traditional waxing.",
      price: "From $25",
      duration: "Varies",
    },
    {
      name: "Full Back Wax",
      description: "Complete back hair removal using premium hard wax for comfort.",
      price: "$60",
      duration: "30 min",
    },
  ],
  hair: [
    {
      name: "Haircut & Style",
      description:
        "A precision cut and blowout tailored to your hair type, face shape, and personal style.",
      price: "From $45",
      duration: "1 hr",
      popular: true,
    },
    {
      name: "Color & Highlights",
      description:
        "Full color, partial or full highlights, or balayage. Consultation included for perfect results.",
      price: "From $85",
      duration: "2+ hrs",
    },
    {
      name: "Blowout",
      description:
        "A luxurious wash and blowout to look your best for any occasion.",
      price: "From $35",
      duration: "45 min",
    },
  ],
};

export default function Services({ showHeader = true }: ServicesProps = {}) {
  const [activeCategory, setActiveCategory] = useState("skin");

  return (
    <section id="services" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-champagne/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {showHeader && (
          <ScrollReveal className="text-center mb-16">
            <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Our Services
            </span>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
              Treatments Tailored <span className="gradient-text">to You</span>
            </h2>
            <div className="section-divider mx-auto mb-6" />
            <p className="text-mocha/70 max-w-2xl mx-auto">
              From transformative facials to meticulous lash artistry, every service is
              performed by certified specialists using premium products with proven results.
            </p>
          </ScrollReveal>
        )}

        {/* Category tabs */}
        <ScrollReveal delay={200} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-champagne to-champagne-dark text-white shadow-lg shadow-champagne/20"
                    : "bg-cream text-mocha hover:bg-latte hover:text-espresso"
                }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Category hero image */}
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeCategory === cat.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/40 to-transparent" />
              <div className="absolute bottom-6 left-8 sm:bottom-8 sm:left-10">
                <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-white mb-1">
                  {cat.label}
                </h3>
                <p className="text-white/60 text-sm">
                  {services[cat.id]?.length} treatments available
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services[activeCategory]?.map((service, i) => (
            <div
              key={service.name}
              className="group relative bg-cream rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:shadow-espresso/5 transition-all duration-500 hover:-translate-y-1 border border-transparent hover:border-latte animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-champagne to-rose text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Popular
                </div>
              )}
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-espresso mb-2 pr-16">
                {service.name}
              </h3>
              <p className="text-mocha/60 text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-latte/50">
                <div className="flex items-center gap-4">
                  <span className="font-[var(--font-display)] text-xl font-bold gradient-text">
                    {service.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-mocha/50">
                    <Clock size={12} />
                    {service.duration}
                  </span>
                </div>
                <a
                  href="#booking"
                  className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-white transition-all"
                >
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <ScrollReveal className="text-center mt-12">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 text-champagne-dark font-semibold hover:gap-4 transition-all"
          >
            View Full Service Menu
            <ArrowRight size={16} />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
