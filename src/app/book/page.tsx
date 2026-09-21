import { Metadata } from "next";
import BookClient from "./BookClient";

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "Book a Strategy Call — 30 Minutes, Free",
  description:
    "Pick a time for a free 30-minute call with Sameem Amjad. Scope, timeline and an honest number for your web, mobile or AI product — no pitch deck.",
  keywords: [
    "book a call",
    "free consultation",
    "software development consultation",
    "strategy call",
    "hire full-stack engineer",
    "DevoraX booking",
  ],
  alternates: { canonical: `${BASE_URL}/book` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/book`,
    siteName: "DevoraX",
    title: "Book a Strategy Call | DevoraX",
    description:
      "Pick a time for a free 30-minute call. Scope, timeline and an honest number — whether or not we work together.",
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Real text under the modal: a crawler (and anyone with JS off) gets a
          page with content rather than an empty shell, and it gives the OG
          card something to match. */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Book a strategy call</h1>
        <p className="mt-4 text-gray-400">
          Thirty minutes, no pitch deck. You&apos;ll leave with a scope, a timeline and a
          number — whether or not we work together. Pick a time that suits you and a
          calendar invitation with a Meet link lands in your inbox.
        </p>
      </section>
      <BookClient />
    </main>
  );
}
