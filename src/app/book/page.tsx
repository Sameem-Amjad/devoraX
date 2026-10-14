import { Metadata } from "next";
import Link from "next/link";
import BookClient from "./BookClient";
import { BRAND_FACTS } from "@/data/brand";
import { OFFER_LADDER } from "@/data/offer";
import { JsonLd } from "@/components/seo/structured-data";
import { OG_IMAGE, SITE_URL, absoluteUrl, breadcrumbNode, webPageNode } from "@/lib/seo";

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
  alternates: { canonical: `${SITE_URL}/book` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/book`,
    siteName: "DevoraX",
    title: "Book a Strategy Call | DevoraX",
    description:
      "Pick a time for a free 30-minute call. Scope, timeline and an honest number — whether or not we work together.",
    // A page-level openGraph replaces the layout's rather than merging with it,
    // so without this the page shipped no og:image and shared links had no card.
    images: [{ ...OG_IMAGE, alt: "Book a strategy call with DevoraX" }],
  },
  // Like openGraph, a missing twitter block falls back to the homepage's card.
  twitter: {
    card: "summary_large_image",
    title: "Book a Strategy Call | DevoraX",
    description:
      "Pick a time for a free 30-minute call. Scope, timeline and an honest number — whether or not we work together.",
    images: [{ ...OG_IMAGE, alt: "Book a strategy call with DevoraX" }],
  },
};

const PATH = "/book";

// The first two rungs of the offer ladder: the call itself, and the audit it
// usually leads to.
const FREE_CALL = OFFER_LADDER[0];
const AUDIT = OFFER_LADDER[1];

/* Every other content page on the site emits a BreadcrumbList; this one did
   not, so Google had to infer a trail for it from internal linking — which is
   where the odd "... > Team > Contact" crumbs in search results come from. */
const breadcrumb = breadcrumbNode(PATH, [{ name: "Book a Call", path: PATH }]);

/* A booking page is a ReserveAction target. Declaring it lets Google
   understand the page's purpose rather than treating it as generic prose. */
const webPage = {
  ...webPageNode({
    path: PATH,
    name: "Book a Strategy Call",
    description:
      "Pick a time for a free 30-minute call with Sameem Amjad — scope, timeline and an honest number for your web, mobile or AI product.",
  }),
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a strategy call",
    target: absoluteUrl(PATH),
    result: {
      "@type": "Reservation",
      name: "30-minute strategy call",
    },
  },
};

export default function BookPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#050505]">
      <JsonLd graph={[webPage, breadcrumb]} />
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
        {/* What the call is for, from the same offer data as /pricing, so an
            assistant booking on someone's behalf (or anyone with JavaScript off)
            can tell what they are agreeing to. */}
        <h2 className="mt-12 text-xl font-semibold text-white">What the call covers</h2>
        <ul className="mx-auto mt-4 max-w-xl list-disc space-y-2 pl-5 text-left text-gray-400">
          <li>{FREE_CALL.body}</li>
          <li>
            If an audit makes sense, what it costs: {AUDIT.price.toLowerCase()}. Every
            price is on the{' '}
            <Link href="/pricing" className="text-teal-400 underline underline-offset-4 hover:text-teal-300">
              pricing page
            </Link>
            .
          </li>
          <li>Calls run {BRAND_FACTS.callHours}.</li>
          <li>
            Prefer email? Write to{' '}
            <a
              href={`mailto:${BRAND_FACTS.salesEmail}`}
              className="text-teal-400 underline underline-offset-4 hover:text-teal-300"
            >
              {BRAND_FACTS.salesEmail}
            </a>
            .
          </li>
        </ul>
      </section>
      <BookClient />
    </main>
  );
}
