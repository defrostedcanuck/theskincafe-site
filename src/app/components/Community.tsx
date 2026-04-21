'use client';

import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { Camera, Quote, Star } from 'lucide-react';

// 9 client quotes preserved verbatim from the retired carousel component.
// Kept inline here (not an external data file) per Plan 02-05 — this is the
// only place in the codebase they render now.
const testimonials = [
  {
    name: 'Jen Jones',
    text: "I've been going to The Skin Cafe and seeing Starr for almost 7 years for my lashes and facials. Her calming energy and delicate technique create the most welcoming environment. Tammy has created something truly special here.",
    service: 'Lashes & Facials',
    rating: 5,
  },
  {
    name: 'Susan Garbayo',
    text: 'I highly recommend Chelsea at the Skin Cafe. You will not be disappointed. She is professional, her expertise is outstanding, and the results speak for themselves. I visit monthly and won\u2019t go anywhere else.',
    service: 'Facials',
    rating: 5,
  },
  {
    name: 'Abby Kaufman',
    text: 'My daughter and I had luxury facials from Chelsea and this was the best facial I have ever had. The visible improvement in my skin was immediate. A truly pampering experience from start to finish.',
    service: 'Luxury Facial',
    rating: 5,
  },
  {
    name: 'Christy Miller',
    text: "I love lashes but hate mascara. Meeting Tamara was truly a gift to myself. The calm atmosphere and natural-looking results simplified my entire routine. I'll never go back to mascara.",
    service: 'Lash Extensions',
    rating: 5,
  },
  {
    name: 'Jane Miller',
    text: "Cydnii does my lash extensions with expertise and efficiency, all the while with a professionalism and sweet personality. She's reliable, skilled, and makes the whole experience enjoyable.",
    service: 'Lash Extensions',
    rating: 5,
  },
  {
    name: 'Michelle B',
    text: 'A beautiful boutique salon! No one does it better than Tammy \u2014 you look like a normal woman with fabulous eyes. I receive compliments all the time from strangers. True artistry.',
    service: 'Lash Extensions',
    rating: 5,
  },
  {
    name: 'Hayley Ahearn',
    text: "Adriana is the best! I absolutely love getting my lashes done by her. She's talented, friendly, and always makes sure I leave looking and feeling amazing.",
    service: 'Lash Extensions',
    rating: 5,
  },
  {
    name: 'Destiny Tanner',
    text: 'Starr is amazing at what she does and I will never let anyone but her touch my lashes. She\u2019s a true artist who takes the time to make sure everything is perfect.',
    service: 'Lash Extensions',
    rating: 5,
  },
  {
    name: 'Cheri Johnston',
    text: 'True artist with lash extensions. I receive compliments all the time from strangers. The attention to detail and care for lash health sets The Skin Cafe apart from everywhere else.',
    service: 'Lash Extensions',
    rating: 5,
  },
] as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export default function Community() {
  const [activeIndex, setActiveIndex] = useState(0);
  const featured = testimonials[activeIndex];

  return (
    <section id="community" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Decorative blurs — match the champagne/rose vocabulary used across sections */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-12">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Our Community
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso leading-tight">
            Decades of relationships,{' '}
            <span className="gradient-text">measured in faces we know by name.</span>
          </h2>
          <div className="section-divider mx-auto mt-6" />
        </ScrollReveal>

        {/* Featured quote block */}
        <ScrollReveal animation="fade-in">
          <div className="relative bg-gradient-to-br from-cream to-cream-dark rounded-3xl p-8 sm:p-12 shadow-sm border border-latte/60">
            <Quote
              size={64}
              aria-hidden="true"
              className="absolute -top-4 -left-2 text-champagne/15 rotate-180"
            />

            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: featured.rating }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  aria-hidden="true"
                  className="fill-champagne text-champagne"
                />
              ))}
            </div>

            <p
              className="font-[var(--font-display)] text-xl sm:text-2xl text-espresso/90 leading-relaxed italic mb-8"
              aria-live="polite"
            >
              &ldquo;{featured.text}&rdquo;
            </p>

            <div>
              <p className="text-espresso font-semibold text-lg">{featured.name}</p>
              <p className="text-champagne/80 text-sm">{featured.service}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Avatar wall — click to swap featured */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
            {testimonials.map((t, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-pressed={isActive}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-champagne text-white ring-2 ring-champagne ring-offset-2 ring-offset-white scale-110'
                      : 'bg-cream text-espresso border border-latte hover:border-champagne hover:-translate-y-0.5'
                  }`}
                >
                  {initials(t.name)}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Instagram CTA tile */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-10 flex justify-center">
            <a
              href="https://www.instagram.com/theskincafe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow The Skin Cafe on Instagram"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose/90 to-champagne/90 text-white font-semibold text-sm shadow-sm hover:shadow-lg hover:shadow-rose/20 transition-all hover:-translate-y-0.5"
            >
              <Camera size={16} aria-hidden="true" />
              Follow on Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
