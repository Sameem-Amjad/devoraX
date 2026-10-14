/**
 * Closing call to action for the company pages (/about, /press, /pricing,
 * /reviews, /glossary): the free 30-minute call every engagement starts with,
 * booked on /book. The copy is the call's own step in the offer ladder, so it
 * says what the call is for in the words the rest of the site uses.
 */
import Link from 'next/link';
import { OFFER_LADDER } from '@/data/offer';

// The ladder opens with the free call (data/offer.ts).
const CALL = OFFER_LADDER[0];

export function BookCallCta() {
  return (
    <section
      aria-labelledby="book-call-heading"
      className="mt-16 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center"
    >
      <h2 id="book-call-heading" className="text-2xl font-bold text-white">
        Start with a free 30-minute call
      </h2>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gray-400">{CALL.body}</p>
      <Link
        href="/book"
        className="mt-7 inline-block rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.35)]"
      >
        Book your free call
      </Link>
    </section>
  );
}
