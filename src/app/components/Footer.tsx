import Image from "next/image";
import Link from "next/link";
import { Heart, Camera, Globe, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Our Team", href: "/team" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Locations", href: "/#locations" },
  { label: "Gilbert", href: "/locations/gilbert" },
  { label: "Scottsdale", href: "/locations/scottsdale" },
  { label: "Contact", href: "/#contact" },
];

const serviceLinks = [
  "Facials & Peels",
  "Eyelash Extensions",
  "TrueBrow\u2122",
  "Waxing & Sugaring",
  "Massage",
  "Hair Salon",
  "Dermaplaning",
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-white/70 relative overflow-hidden">
      {/* Top decorative border */}
      <div className="h-1 bg-gradient-to-r from-champagne via-rose to-champagne" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/images/logo.png"
                alt="The Skin Cafe"
                width={360}
                height={130}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Arizona&apos;s premier destination for facials, lash extensions, brows,
              and body treatments. Two luxurious locations serving Gilbert and Scottsdale.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/theskincafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-champagne/30 hover:text-champagne transition-all"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
              <a
                href="https://www.facebook.com/theskincafesalon/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-champagne/30 hover:text-champagne transition-all"
                aria-label="Facebook"
              >
                <Globe size={16} />
              </a>
              <a
                href="tel:4806190046"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-champagne/30 hover:text-champagne transition-all"
                aria-label="Phone"
              >
                <Phone size={14} />
              </a>
              <a
                href="mailto:info@theskincafe.net"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-champagne/30 hover:text-champagne transition-all"
                aria-label="Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-champagne transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm hover:text-champagne transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Locations
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-white text-sm font-medium mb-1">Gilbert</p>
                <p className="text-xs leading-relaxed">
                  4100 S Lindsay Rd #121
                  <br />
                  Gilbert, AZ 85297
                </p>
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">Scottsdale</p>
                <p className="text-xs leading-relaxed">
                  10333 N Scottsdale Rd, Unit 1
                  <br />
                  Scottsdale, AZ 85253
                </p>
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">Hours</p>
                <p className="text-xs leading-relaxed">
                  Mon-Thu: 10am-8pm
                  <br />
                  Fri: 9am-5pm | Sat: 9am-6pm
                  <br />
                  Sun: 2pm-8pm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} The Skin Cafe. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Cancellation Policy
            </a>
          </div>
          <p className="text-xs text-white/30 flex items-center gap-1">
            Made with <Heart size={10} className="text-rose fill-rose" /> in Arizona
          </p>
        </div>
      </div>
    </footer>
  );
}
