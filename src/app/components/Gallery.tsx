"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { X, ZoomIn } from "lucide-react";

const galleryCategories = ["All", "Lashes", "Brows", "Facials", "Spa"];

interface GalleryItem {
  id: number;
  category: string;
  title: string;
  image: string;
  span?: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, category: "Lashes", title: "Classic Full Set", image: "/images/lash-extensions.jpg", span: "col-span-2 row-span-2" },
  { id: 2, category: "Facials", title: "The Perfect Peel", image: "/images/treatment-facial-mask.jpg" },
  { id: 3, category: "Brows", title: "TrueBrow\u2122 Design", image: "/images/brows.jpg" },
  { id: 4, category: "Facials", title: "Laser Treatment", image: "/images/treatment-laser.jpg" },
  { id: 5, category: "Spa", title: "Relaxation Suite", image: "/images/spa-candles.jpg", span: "col-span-2" },
  { id: 6, category: "Spa", title: "Premium Products", image: "/images/skincare-products.jpg" },
  { id: 7, category: "Facials", title: "LED Light Therapy", image: "/images/treatment-led.jpg" },
  { id: 8, category: "Spa", title: "Facial Massage", image: "/images/treatment-massage.jpg" },
  { id: 9, category: "Spa", title: "Treatment Room", image: "/images/salon-interior.jpg", span: "col-span-2 row-span-2" },
  { id: 10, category: "Facials", title: "Deep Cleanse Facial", image: "/images/massage.jpg" },
  { id: 11, category: "Spa", title: "Spa Ambiance", image: "/images/spa-towels.jpg" },
  { id: 12, category: "Facials", title: "Hair & Beauty", image: "/images/hair-salon.jpg" },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Our Work
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Beauty <span className="gradient-text">Portfolio</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 max-w-2xl mx-auto">
            See the artistry for yourself. Browse our collection of client transformations
            and get inspired for your next visit.
          </p>
        </ScrollReveal>

        {/* Filter */}
        <ScrollReveal delay={150} className="flex flex-wrap justify-center gap-2 mb-12">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat
                  ? "bg-espresso text-white shadow-lg"
                  : "bg-cream text-mocha hover:bg-latte"
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${item.span || ""} animate-scale-in`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setLightbox(item)}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes={item.span?.includes("col-span-2") ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/60 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  <ZoomIn size={24} className="text-white mx-auto mb-2" />
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs mt-1">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-espresso/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>
          <div
            className="w-full max-w-3xl aspect-[4/3] rounded-3xl overflow-hidden relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={lightbox.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-espresso/80 to-transparent p-6">
              <p className="font-[var(--font-display)] text-xl text-white font-semibold">
                {lightbox.title}
              </p>
              <p className="text-white/60 text-sm">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
