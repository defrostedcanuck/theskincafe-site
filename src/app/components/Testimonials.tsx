"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jen Jones",
    text: "I've been going to The Skin Cafe and seeing Starr for almost 7 years for my lashes and facials. Her calming energy and delicate technique create the most welcoming environment. Tammy has created something truly special here.",
    service: "Lashes & Facials",
    rating: 5,
  },
  {
    name: "Susan Garbayo",
    text: "I highly recommend Chelsea at the Skin Cafe. You will not be disappointed. She is professional, her expertise is outstanding, and the results speak for themselves. I visit monthly and won't go anywhere else.",
    service: "Facials",
    rating: 5,
  },
  {
    name: "Abby Kaufman",
    text: "My daughter and I had luxury facials from Chelsea and this was the best facial I have ever had. The visible improvement in my skin was immediate. A truly pampering experience from start to finish.",
    service: "Luxury Facial",
    rating: 5,
  },
  {
    name: "Christy Miller",
    text: "I love lashes but hate mascara. Meeting Tamara was truly a gift to myself. The calm atmosphere and natural-looking results simplified my entire routine. I'll never go back to mascara.",
    service: "Lash Extensions",
    rating: 5,
  },
  {
    name: "Jane Miller",
    text: "Cydnii does my lash extensions with expertise and efficiency, all the while with a professionalism and sweet personality. She's reliable, skilled, and makes the whole experience enjoyable.",
    service: "Lash Extensions",
    rating: 5,
  },
  {
    name: "Michelle B",
    text: "A beautiful boutique salon! No one does it better than Tammy — you look like a normal woman with fabulous eyes. I receive compliments all the time from strangers. True artistry.",
    service: "Lash Extensions",
    rating: 5,
  },
  {
    name: "Hayley Ahearn",
    text: "Adriana is the best! I absolutely love getting my lashes done by her. She's talented, friendly, and always makes sure I leave looking and feeling amazing.",
    service: "Lash Extensions",
    rating: 5,
  },
  {
    name: "Destiny Tanner",
    text: "Starr is amazing at what she does and I will never let anyone but her touch my lashes. She's a true artist who takes the time to make sure everything is perfect.",
    service: "Lash Extensions",
    rating: 5,
  },
  {
    name: "Cheri Johnston",
    text: "True artist with lash extensions. I receive compliments all the time from strangers. The attention to detail and care for lash health sets The Skin Cafe apart from everywhere else.",
    service: "Lash Extensions",
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((p) => (p + 1) % testimonials.length);

  return (
    <section id="reviews" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/spa-towels.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-espresso/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(201,169,110,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(183,110,121,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-16">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Client Love
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white mb-4">
            What Our Clients <span className="text-champagne">Say</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          {/* Google rating badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-champagne text-champagne" />
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">
              4.9 Rating on Google
            </span>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative">
            {/* Quote icon */}
            <Quote
              size={80}
              className="absolute -top-4 -left-4 text-champagne/10 rotate-180"
            />

            {/* Active testimonial */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 min-h-[280px] flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-champagne text-champagne"
                  />
                ))}
              </div>
              <p className="font-[var(--font-display)] text-xl sm:text-2xl text-white/90 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">
                    {testimonials[active].name}
                  </p>
                  <p className="text-champagne/80 text-sm">
                    {testimonials[active].service}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-champagne/50 hover:bg-champagne/10 transition-all"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === active
                        ? "w-8 h-2 bg-champagne"
                        : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-champagne/50 hover:bg-champagne/10 transition-all"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
