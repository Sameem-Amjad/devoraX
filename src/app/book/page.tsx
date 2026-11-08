import { Metadata } from "next";
import Link from "next/link";
import BookClient from "./BookClient";
import { BRAND_FACTS } from "@/data/brand";
import { OFFER_LADDER } from "@/data/offer";
import { allInsightSlugs } from "@/data/insights";
import { allSolutionSlugs } from "@/data/solutions";
import { NEXT_START_TERM_ID, TERMS } from "@/data/terms";
import type { BookingPages } from "@/lib/booking/attribution";
import { InlineText } from "@/components/seo/rich-text";
import { JsonLd } from "@/components/seo/structured-data";
import { TermAnswer } from "@/components/seo/terms-block";
import { OG_IMAGE, SITE_URL, absoluteUrl, breadcrumbNode, webPageNode } from "@/lib/seo";

/* Hourly, so the start date (data/terms.ts) is checked against the day the
   page is served: a week that has passed becomes "ask on the call" within the
   hour instead of staying up until the next deploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  // The call decides whether an audit comes first; it does not produce a
  // delivery date or a quote, so the copy no longer promises either. Title and
  // description within limits: 51 characters with " | DevoraX", and 155.
  title: "Book a Free 30-Minute Call About Your App",
  description:
    "Book a free 30-minute call with Sameem Amjad. You'll leave knowing whether an audit makes sense, what it costs, and the published price range for the work.",
  keywords: [
    "book a call",
    "free consultation",
    "software development consultation",
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
    title: "Book a Free 30-Minute Call About Your App | DevoraX",
    description:
      "Pick a time for a free 30-minute call. You'll leave knowing whether an audit makes sense, what it costs, and the published price range for the work.",
    // A page-level openGraph replaces the layout's rather than merging with it,
    // so without this the page shipped no og:image and shared links had no card.
    images: [{ ...OG_IMAGE, alt: "Book a free 30-minute call with DevoraX" }],
  },
  // Like openGraph, a missing twitter block falls back to the homepage's card.
  twitter: {
    card: "summary_large_image",
    title: "Book a Free 30-Minute Call About Your App | DevoraX",
    description:
      "Pick a time for a free 30-minute call. You'll leave knowing whether an audit makes sense, what it costs, and the published price range for the work.",
    images: [{ ...OG_IMAGE, alt: "Book a free 30-minute call with DevoraX" }],
  },
};

const PATH = "/book";

// The first two rungs of the offer ladder: the call itself, and the audit it
// usually leads to.
const FREE_CALL = OFFER_LADDER[0];
const AUDIT = OFFER_LADDER[1];

// The terms row that pairs the start date with the audit's turnaround.
const START = TERMS.find((t) => t.id === NEXT_START_TERM_ID);

// The other wait a founder can start on the day they book, sentence for
// sentence and link for link as the App Store door page sources it (its
// "Start the accounts early" step, data/solutions.ts). Change both together.
const DUNS_LINE =
  "Publishing under a company name? As of November 2026, Apple needs a D-U-N-S Number, and [its help page](https://developer.apple.com/help/account/membership/D-U-N-S/) says to allow up to 5 business days to receive one from Dun & Bradstreet, then up to 2 business days for Apple to receive it. A Google Play organisation account needs one too, according to [Google's account types page](https://support.google.com/googleplay/android-developer/answer/13634885). Request it the day you book.";

// The page names a /book?from= link may carry (BookClient). Read here, so the
// browser gets two short lists rather than the page data they come from.
const BOOKING_PAGES: BookingPages = {
  solutions: allSolutionSlugs(),
  insights: allInsightSlugs(),
};

/* Every other content page on the site emits a BreadcrumbList; this one did
   not, so Google had to infer a trail for it from internal linking — which is
   where the odd "... > Team > Contact" crumbs in search results come from. */
const breadcrumb = breadcrumbNode(PATH, [{ name: "Book a Call", path: PATH }]);

/* A booking page is a ReserveAction target. Declaring it lets Google
   understand the page's purpose rather than treating it as generic prose. */
const webPage = {
  ...webPageNode({
    path: PATH,
    name: "Book a Free 30-Minute Call About Your App",
    description:
      "Book a free 30-minute call with Sameem Amjad. You'll leave knowing whether an audit makes sense, what it costs, and the published price range for the work.",
  }),
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a free 30-minute call",
    target: absoluteUrl(PATH),
    result: {
      "@type": "Reservation",
      name: "Free 30-minute call",
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
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Book a free 30-minute call</h1>
        <p className="mt-4 text-gray-400">
          Thirty minutes, no pitch deck and no obligation to work with us. You&apos;ll leave
          knowing whether an audit makes sense, what it costs, and the published price range
          for the work. Pick a time that suits you and a calendar invitation with a Meet link
          lands in your inbox.
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
          {START && (
            <li>
              <TermAnswer term={START} surface="doors" />
            </li>
          )}
          <li>
            <InlineText text={DUNS_LINE} />
          </li>
          {/* callHours is a full sentence, US times included. The calendar
              below shows every slot in the visitor's own time zone. */}
          <li>Calls run {BRAND_FACTS.callHours}</li>
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
      <BookClient pages={BOOKING_PAGES} />
    </main>
  );
}
