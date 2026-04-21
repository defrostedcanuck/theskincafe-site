export const hoursOfOperation = [
  { day: "Monday – Thursday", time: "10:00 AM – 8:00 PM" },
  { day: "Friday", time: "9:00 AM – 5:00 PM" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM" },
  { day: "Sunday", time: "2:00 PM – 8:00 PM" },
];

export type LocationSlug = "gilbert" | "scottsdale";

export interface Location {
  slug: LocationSlug;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  note: string | null;
  iconColor: string;
  gradient: string;
  image: string;
  mapQuery: string;
  bookingUrl: string;
  headline: string;
  neighborhoodBlurb: string;
}

export const locations: Location[] = [
  {
    slug: "gilbert",
    name: "Gilbert",
    address: "4100 S Lindsay Rd #121",
    city: "Gilbert",
    state: "AZ",
    postalCode: "85297",
    phone: "(480) 619-0046",
    note: null,
    iconColor: "text-champagne",
    gradient: "from-champagne to-champagne-dark",
    image: "/images/salon-interior.jpg",
    mapQuery:
      "4100+S+Lindsay+Rd+%23121+Gilbert+AZ+85297",
    bookingUrl:
      "https://book.squareup.com/appointments/y5eu65pg42prz2/location/WVJ7770QWMRGA/availability",
    headline: "Luxury aesthetics in the East Valley",
    neighborhoodBlurb:
      "Our flagship Gilbert studio serves clients across Chandler, Queen Creek, Mesa, and the greater East Valley — a calm, unhurried space where long-time regulars and first-time visitors receive the same unhurried care.",
  },
  {
    slug: "scottsdale",
    name: "Scottsdale",
    address: "10333 N Scottsdale Rd, Unit 1",
    city: "Scottsdale",
    state: "AZ",
    postalCode: "85253",
    phone: "(480) 619-0046",
    note: "Inside Blush Skin & Wax",
    iconColor: "text-rose",
    gradient: "from-rose to-rose-dark",
    image: "/images/spa-candles.jpg",
    mapQuery:
      "10333+N+Scottsdale+Rd+Unit+1+Scottsdale+AZ+85253",
    bookingUrl:
      "https://book.squareup.com/appointments/y5eu65pg42prz2/location/86SPWSYBFQR7Z/services/OGM2CC55EWUWGQEA73EXVYUN?savt=9af9b333-518a-4f8b-a281-58f492606f9b",
    headline: "Boutique beauty in North Scottsdale",
    neighborhoodBlurb:
      "Tucked inside Blush Skin & Wax on North Scottsdale Road, our Scottsdale studio brings the same personal care and technical expertise to clients across Paradise Valley, Old Town, and the Shea corridor.",
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
