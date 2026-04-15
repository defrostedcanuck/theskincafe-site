import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Calendar, ArrowRight, Sparkles, MapPin, ExternalLink } from "lucide-react";

const GILBERT_URL =
  "https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability";
const SCOTTSDALE_URL =
  "https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b";

export default function BookingCTA() {
  return (
    <section
      id="booking"
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="/images/spa-stones.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-espresso/75" />
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-champagne/10" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-champagne/5" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-8">
            <Calendar size={14} className="text-champagne" />
            <span className="text-white/80 text-sm font-medium">
              Now Booking All Services
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Look &<br />
            Feel <span className="text-champagne">Amazing?</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Book your appointment today and step into a world of relaxation,
            rejuvenation, and radiant results. New clients welcome.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GILBERT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer group bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-champagne/30 transition-all hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Sparkles size={18} />
              Book Gilbert
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href={SCOTTSDALE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer group bg-gradient-to-r from-rose to-rose-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-rose/30 transition-all hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Sparkles size={18} />
              Book Scottsdale
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="text-white/30 text-sm mt-8">
            Walk-ins welcome based on availability &middot; 24hr cancellation
            policy applies
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
