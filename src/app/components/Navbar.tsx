"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "Locations", href: "#locations" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg shadow-espresso/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne to-rose flex items-center justify-center text-white font-[var(--font-display)] text-lg font-bold transition-transform group-hover:scale-110">
              SC
            </div>
            <div>
              <span
                className={`font-[var(--font-display)] text-xl font-semibold tracking-wide transition-colors ${
                  scrolled ? "text-espresso" : "text-white"
                }`}
              >
                The Skin Cafe
              </span>
              <span
                className={`block text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  scrolled ? "text-mocha/60" : "text-white/60"
                }`}
              >
                Beauty & Aesthetics
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-champagne/10 ${
                  scrolled
                    ? "text-espresso/80 hover:text-espresso"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:4806190046"
              className={`flex items-center gap-2 text-sm transition-colors ${
                scrolled ? "text-mocha" : "text-white/80"
              }`}
            >
              <Phone size={14} />
              (480) 619-0046
            </a>
            <div className="relative">
              <button
                onClick={() => setBookingOpen(!bookingOpen)}
                className="btn-shimmer bg-gradient-to-r from-champagne to-champagne-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-champagne/30 transition-all hover:-translate-y-0.5"
              >
                Book Now
                <ChevronDown
                  size={14}
                  className={`transition-transform ${bookingOpen ? "rotate-180" : ""}`}
                />
              </button>
              {bookingOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-espresso/10 border border-latte overflow-hidden animate-scale-in origin-top-right">
                  <a
                    href="#booking"
                    onClick={() => setBookingOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors"
                  >
                    <MapPin size={16} className="text-champagne" />
                    <div>
                      <p className="text-sm font-semibold text-espresso">Gilbert</p>
                      <p className="text-xs text-mocha/60">Lindsay Rd</p>
                    </div>
                  </a>
                  <div className="border-t border-latte" />
                  <a
                    href="#booking"
                    onClick={() => setBookingOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors"
                  >
                    <MapPin size={16} className="text-rose" />
                    <div>
                      <p className="text-sm font-semibold text-espresso">Scottsdale</p>
                      <p className="text-xs text-mocha/60">Scottsdale Rd</p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-espresso" : "text-white"
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-espresso/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-cream shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="font-[var(--font-display)] text-xl font-semibold text-espresso">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-mocha hover:bg-latte transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-espresso/80 hover:text-espresso hover:bg-champagne/10 rounded-lg transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <a
              href="tel:4806190046"
              className="flex items-center gap-3 px-4 py-3 text-mocha"
            >
              <Phone size={16} />
              (480) 619-0046
            </a>
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-champagne to-champagne-dark text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Book — Gilbert
            </a>
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-rose to-rose-dark text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Book — Scottsdale
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
