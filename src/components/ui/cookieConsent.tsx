"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "devorax-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-md"
    >
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        We use essential cookies for site functionality and anonymous analytics
        to improve performance.{" "}
        <a
          href="/#faq"
          className="text-teal-400 underline underline-offset-2 hover:text-teal-300 transition-colors"
        >
          Learn more
        </a>
      </p>
      <div className="flex gap-3">
        <button
          onClick={accept}
          className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 py-2 px-4 rounded-lg border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
