"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Calendar, MapPin, Loader2 } from "lucide-react";

const locations = [
  {
    id: "gilbert",
    name: "Gilbert",
    subtitle: "Lindsay Rd",
    url: "https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability",
    gradient: "from-champagne to-champagne-dark",
    iconColor: "text-champagne",
    shadow: "shadow-champagne/20",
  },
  {
    id: "scottsdale",
    name: "Scottsdale",
    subtitle: "Scottsdale Rd",
    url: "https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b",
    gradient: "from-rose to-rose-dark",
    iconColor: "text-rose",
    shadow: "shadow-rose/20",
  },
];

export default function BookingCTA() {
  const [active, setActive] = useState("gilbert");
  const [loading, setLoading] = useState(true);

  // Listen for hash changes to auto-select location tab
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === "#book-scottsdale") setActive("scottsdale");
      else if (hash === "#book-gilbert" || hash === "#booking") setActive("gilbert");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // Reset loading state when tab changes
  useEffect(() => {
    setLoading(true);
  }, [active]);

  const current = locations.find((l) => l.id === active)!;

  return (
    <section id="booking" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/spa-stones.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-espresso/80" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
              <Calendar size={14} className="text-champagne" />
              <span className="text-white/80 text-sm font-medium">
                Online Booking
              </span>
            </div>
            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Book Your <span className="text-champagne">Appointment</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Select your preferred location and book online instantly.
              New clients welcome.
            </p>
          </div>
        </ScrollReveal>

        {/* Location tabs */}
        <div id="book-gilbert" />
        <div id="book-scottsdale" />
        <ScrollReveal delay={100}>
          <div className="flex justify-center gap-3 mb-8">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActive(loc.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  active === loc.id
                    ? `bg-gradient-to-r ${loc.gradient} text-white shadow-lg ${loc.shadow}`
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80"
                }`}
              >
                <MapPin size={16} />
                {loc.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Embedded booking */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/20 relative">
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
                <div className="text-center">
                  <Loader2
                    size={32}
                    className="text-champagne animate-spin mx-auto mb-3"
                  />
                  <p className="text-mocha/60 text-sm">
                    Loading {current.name} booking...
                  </p>
                </div>
              </div>
            )}
            <iframe
              key={active}
              src={current.url}
              title={`Book at The Skin Cafe ${current.name}`}
              className="w-full border-0"
              style={{ height: "700px" }}
              onLoad={() => setLoading(false)}
              allow="payment"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="text-white/30 text-sm mt-8 text-center">
            Walk-ins welcome based on availability &middot; 24hr cancellation
            policy applies
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
