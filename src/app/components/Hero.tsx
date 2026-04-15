"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles, Star } from "lucide-react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-spa.jpg"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-espresso/60" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-transparent to-espresso/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(44,24,16,0.3)_100%)]" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-champagne/20 rounded-full animate-float"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Sparkles size={14} className="text-champagne" />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            Gilbert & Scottsdale, Arizona
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`font-[var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Relax.{" "}
          <span className="gradient-text">Rejuvenate.</span>
          <br />
          Radiate.
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-400 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Where artistry meets science. Experience premium facials, lash extensions,
          brows, and body treatments in Arizona&apos;s most luxurious beauty sanctuary.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <a
            href="https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer group bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-champagne/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            Book in Gilbert
          </a>
          <a
            href="https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer group bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 hover:shadow-2xl transition-all hover:-translate-y-1 w-full sm:w-auto"
          >
            Book in Scottsdale
          </a>
        </div>

        {/* Trust bar */}
        <div
          className={`flex flex-wrap items-center justify-center gap-6 sm:gap-8 transition-all duration-700 delay-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-champagne text-champagne" />
            ))}
            <span className="text-white/60 text-sm ml-2">4.9 on Google</span>
          </div>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <span className="text-white/60 text-sm">10+ Years of Excellence</span>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <span className="text-white/60 text-sm">2 Luxurious Locations</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Discover</span>
        <ChevronDown size={20} className="animate-bounce" />
      </a>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
