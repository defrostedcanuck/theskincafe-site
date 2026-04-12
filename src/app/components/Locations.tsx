import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { MapPin, Phone, Clock, Navigation, ArrowRight } from "lucide-react";

const locations = [
  {
    name: "Gilbert",
    address: "4100 S Lindsay Rd #121",
    city: "Gilbert, AZ 85297",
    phone: "(480) 619-0046",
    note: null,
    iconColor: "text-champagne",
    gradient: "from-champagne to-champagne-dark",
    image: "/images/salon-interior.jpg",
    mapQuery: "4100+S+Lindsay+Rd+%23121+Gilbert+AZ+85297",
  },
  {
    name: "Scottsdale",
    address: "10333 N Scottsdale Rd, Unit 1",
    city: "Scottsdale, AZ 85253",
    phone: "(480) 619-0046",
    note: "Inside Blush Skin & Wax",
    iconColor: "text-rose",
    gradient: "from-rose to-rose-dark",
    image: "/images/spa-candles.jpg",
    mapQuery: "10333+N+Scottsdale+Rd+Unit+1+Scottsdale+AZ+85253",
  },
];

const hours = [
  { day: "Monday \u2013 Thursday", time: "10:00 AM \u2013 8:00 PM" },
  { day: "Friday", time: "9:00 AM \u2013 5:00 PM" },
  { day: "Saturday", time: "9:00 AM \u2013 6:00 PM" },
  { day: "Sunday", time: "2:00 PM \u2013 8:00 PM" },
];

export default function Locations() {
  return (
    <section id="locations" className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-cream-dark/30 to-cream" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-16">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Visit Us
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Two Luxurious <span className="gradient-text">Locations</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 max-w-2xl mx-auto">
            Whether you&apos;re in the East Valley or North Scottsdale, a world-class beauty
            experience is just minutes away.
          </p>
        </ScrollReveal>

        {/* Location cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {locations.map((loc, i) => (
            <ScrollReveal key={loc.name} delay={i * 200}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/8 transition-all duration-500 group">
                {/* Location image */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={`The Skin Cafe ${loc.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} opacity-30`} />
                  {/* Directions button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white text-xs font-medium flex items-center gap-2 hover:bg-white/30 transition-colors"
                  >
                    <Navigation size={12} />
                    Get Directions
                  </a>
                </div>

                <div className="p-8">
                  <h3 className="font-[var(--font-display)] text-2xl font-bold text-espresso mb-4">
                    {loc.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className={`${loc.iconColor} mt-0.5 shrink-0`} />
                      <div>
                        <p className="text-mocha text-sm">{loc.address}</p>
                        <p className="text-mocha text-sm">{loc.city}</p>
                        {loc.note && (
                          <p className="text-mocha/50 text-xs mt-1 italic">{loc.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className={`${loc.iconColor} shrink-0`} />
                      <a
                        href={`tel:${loc.phone.replace(/[^0-9]/g, "")}`}
                        className="text-mocha text-sm hover:text-espresso transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </div>
                  </div>

                  <a
                    href="#booking"
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${loc.gradient} text-white px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 btn-shimmer`}
                  >
                    Book at {loc.name}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Hours */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
                <Clock size={18} className="text-champagne" />
              </div>
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-espresso">
                Hours of Operation
              </h3>
            </div>
            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-center justify-between py-2 border-b border-latte/50 last:border-0"
                >
                  <span className="text-mocha text-sm font-medium">{h.day}</span>
                  <span className="text-espresso text-sm font-semibold">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
