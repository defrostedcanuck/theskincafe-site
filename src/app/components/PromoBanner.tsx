"use client";

import { useState } from "react";
import { X, Gift } from "lucide-react";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm animate-fade-up">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-espresso/15 border border-latte/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-champagne via-rose to-champagne" />
        <div className="p-5 relative">
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-latte/50 flex items-center justify-center text-mocha/40 hover:text-mocha hover:bg-latte transition-all"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-champagne/20 to-rose/20 flex items-center justify-center shrink-0">
              <Gift size={20} className="text-champagne" />
            </div>
            <div className="pr-4">
              <p className="font-[var(--font-display)] text-base font-semibold text-espresso mb-1">
                New Client Special
              </p>
              <p className="text-mocha/60 text-sm mb-3">
                20% off your first facial or lash set. Book today!
              </p>
              <a
                href="#booking"
                onClick={() => setVisible(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-champagne-dark hover:text-champagne transition-colors"
              >
                Claim Offer &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
