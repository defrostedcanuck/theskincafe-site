import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Phone, Clock, Navigation, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Services from "../../components/Services";
import BookingCTA from "../../components/BookingCTA";
import Footer from "../../components/Footer";
import PromoBanner from "../../components/PromoBanner";
import {
  getLocation,
  locations,
  hoursOfOperation,
} from "../../lib/locations";

type RouteParams = Promise<{ city: string }>;

export function generateStaticParams() {
  return locations.map((loc) => ({ city: loc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return { title: "Location Not Found" };
  return {
    title: `${loc.name} Location | The Skin Cafe`,
    description: `${loc.headline} — The Skin Cafe at ${loc.address}, ${loc.city}, ${loc.state}. Book facials, lashes, brows, and more with our specialists in ${loc.name}.`,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

export default async function LocationPage({ params }: { params: RouteParams }) {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return notFound();

  return (
    <>
      <Navbar variant="solid" />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-cream via-white to-latte/30 overflow-hidden border-b border-latte/60 shadow-sm shadow-espresso/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-rose/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-champagne text-sm font-semibold uppercase tracking-[0.25em] mb-4 block">
                  The Skin Cafe — {loc.name}
                </span>
                <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-5 leading-[1.05]">
                  {loc.headline}
                </h1>
                <div className="section-divider mb-6" />
                <p className="text-mocha/70 text-lg leading-relaxed mb-8">
                  {loc.neighborhoodBlurb}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className={`${loc.iconColor} mt-1 shrink-0`} />
                    <div>
                      <p className="text-mocha">{loc.address}</p>
                      <p className="text-mocha">
                        {loc.city}, {loc.state} {loc.postalCode}
                      </p>
                      {loc.note && (
                        <p className="text-mocha/50 text-xs mt-1 italic">
                          {loc.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className={`${loc.iconColor} shrink-0`} />
                    <a
                      href={`tel:${loc.phone.replace(/[^0-9]/g, "")}`}
                      className="text-mocha hover:text-espresso transition-colors"
                    >
                      {loc.phone}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={loc.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${loc.gradient} text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all btn-shimmer`}
                  >
                    Book at {loc.name}
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white border border-latte text-espresso px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-latte/40 transition-colors"
                  >
                    <Navigation size={14} />
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-espresso/20">
                <Image
                  src={loc.image}
                  alt={`The Skin Cafe ${loc.name} interior`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${loc.gradient} opacity-20`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-cream/50 rounded-3xl p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
                  <Clock size={18} className="text-champagne" />
                </div>
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-espresso">
                  Hours of Operation
                </h2>
              </div>
              <div className="space-y-3">
                {hoursOfOperation.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between py-2 border-b border-latte/50 last:border-0"
                  >
                    <span className="text-mocha text-sm font-medium">
                      {h.day}
                    </span>
                    <span className="text-espresso text-sm font-semibold">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Services showHeader={false} />
        <BookingCTA />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
