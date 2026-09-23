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

/* Every other content page on the site emits a BreadcrumbList; this one did
   not, so Google had to infer a trail for it from internal linking — which is
   where the odd "... > Team > Contact" crumbs in search results come from.
   Matches the shape used by /team and /services so the whole site is
   consistent. */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${BASE_URL}/book#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Book a Call", item: `${BASE_URL}/book` },
  ],
};

/* A booking page is a ReserveAction target. Declaring it lets Google
   understand the page's purpose rather than treating it as generic prose. */
const reserveSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/book#webpage`,
  url: `${BASE_URL}/book`,
  name: "Book a Strategy Call",
  description:
    "Pick a time for a free 30-minute call with Sameem Amjad — scope, timeline and an honest number for your web, mobile or AI product.",
  breadcrumb: { "@id": `${BASE_URL}/book#breadcrumb` },
  isPartOf: { "@id": `${BASE_URL}/#website` },
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a strategy call",
    target: `${BASE_URL}/book`,
    result: {
      "@type": "Reservation",
      name: "30-minute strategy call",
    },
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reserveSchema) }}
      />
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
