import Link from "next/link";
import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { FIVERR_PROFILE_URL, TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { SectionHeading } from "./sectionHeading";

/**
 * Six client reviews, each from a different client.
 *
 * The reviews are the studio's: they come from DevoraX's Fiverr profile, which
 * is in Sameem's name (owner decision, 8 Nov 2026), and every handle here can
 * be checked against it. The countries in the intro are the whole record's,
 * not only the six reviews shown.
 *
 * The grid used to take the first six entries of the list, and one reviewer
 * (who has left three reviews) filled two of the six cards. It now takes the
 * first review from each of the first six reviewers. Set in columns rather
 * than rows, so cards keep their own height instead of stretching to the
 * longest quote in the row.
 *
 * Not marked up with Review or AggregateRating structured data: see
 * data/testimonials.ts.
 */
const SHOWN = 6;

function firstPerReviewer(reviews: Testimonial[], limit: number): Testimonial[] {
  const seen = new Set<string>();
  const out: Testimonial[] = [];
  for (const review of reviews) {
    if (seen.has(review.username)) continue;
    seen.add(review.username);
    out.push(review);
    if (out.length === limit) break;
  }
  return out;
}

const link = "text-paper underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

export const ReviewsSection = () => {
  const reviews = firstPerReviewer(TESTIMONIALS, SHOWN);

  return (
    <section
      id="testimonials"
      aria-labelledby="reviews-heading"
      className="home-section glow-left scroll-mt-24 bg-ink py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="06" label="Reviews" headingId="reviews-heading" title="Reviews from our Fiverr clients">
          <p>
            Every review below is a real, public review from DevoraX&apos;s Fiverr profile, which
            is in Sameem Amjad&apos;s name, written by a client who hired us there. Our record
            there: a 5.0 rating across 50+ projects since January 2022, with clients in the US,
            the UK, Canada and Hong Kong.{" "}
            <a href={FIVERR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={link}>
              Verify them on Fiverr
            </a>
            , or{" "}
            <Link href="/reviews" className={link}>
              read all {TESTIMONIALS.length} reviews
            </Link>
            .
          </p>
        </SectionHeading>

        {/* On a phone the six cards are one row to swipe through, about one
            screen tall, instead of six screens stacked; from `md` they are
            columns. */}
        <ul className="scrollbar-hide -mx-6 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:block md:columns-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:columns-3">
          {reviews.map((review, i) => (
            <Reveal
              as="li"
              key={review.username}
              delay={(i % 3) * 80}
              className="spotlight flex w-[86%] flex-shrink-0 snap-center break-inside-avoid flex-col rounded-2xl border border-rule bg-ink-raised p-7 md:mb-5 md:w-auto"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }, (_, s) => (
                    <Star key={s} aria-hidden="true" className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </span>
                {/* Checkable, unlike an outcome figure: the review on Fiverr
                    carries the delivery's screenshot. */}
                {review.hasDeliveryProof && (
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-paper-faint">
                    Delivery screenshot attached
                  </span>
                )}
              </div>

              <blockquote className="mt-5 flex-grow text-[0.98rem] leading-relaxed text-paper">
                <p>{review.text}</p>
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-rule pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-rule-strong bg-ink-high font-display text-sm font-semibold text-paper"
                >
                  {review.username.charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="text-sm font-semibold text-paper">{review.username}</div>
                  <div className="mt-0.5 text-xs text-paper-faint">{review.country} · Verified Fiverr review</div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};
