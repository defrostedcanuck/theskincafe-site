import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Skin Cafe | Premium Beauty & Aesthetics Spa — Gilbert & Scottsdale, AZ",
  description:
    "Arizona's premier beauty destination for facials, eyelash extensions, brows, waxing, sugaring, massage & more. Two luxurious locations in Gilbert and Scottsdale.",
  keywords: [
    "spa",
    "facial",
    "eyelash extensions",
    "Gilbert AZ",
    "Scottsdale AZ",
    "waxing",
    "beauty salon",
    "skin care",
    "massage",
    "dermaplaning",
    "chemical peel",
    "sugaring",
  ],
  openGraph: {
    title: "The Skin Cafe | Premium Beauty & Aesthetics Spa",
    description:
      "Relax. Rejuvenate. Radiate. Arizona's premier multi-location beauty destination.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
