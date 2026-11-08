"use client";

/* Standalone wrapper for the booking modal.
 *
 * The modal was only reachable by clicking a button on the homepage, so there
 * was no URL that meant "book a call" — nothing to link from the portfolio, an
 * email signature or a proposal. This gives it one.
 *
 * It reuses the same component rather than forking the UI, so there is one
 * booking flow to keep correct, not two.
 *
 * It also says where the booking came from, since every booking made here
 * would otherwise count as made on /book. Links carry ?from=: a page's own
 * name (/book?from=fix-vibe-coded-app, from=pricing, from=34), which becomes
 * the path stored as booked_from, or a profile's (from=linkedin), which sets
 * the lead channel (lib/booking/attribution.ts). A link without one, such as
 * the header's, counts as made from the page the visitor was on before
 * (lib/booking/visit.ts).
 */

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/models/bookingModel/bookingModel";
import { resolveBookingLink, type BookingPages } from "@/lib/booking/attribution";
import { noteLeadChannel, routeBefore } from "@/lib/booking/visit";

// ?from= is read only after hydration, the way the modal reads the time zone:
// the server renders this page once for every query string, so its snapshot
// has none, and the first client render matches the server's HTML. Reading it
// with useSearchParams instead would drop the modal from the static HTML.
const noSubscribe = () => () => {};
const readFrom = () => new URLSearchParams(window.location.search).get("from");
const noFrom = () => null;

export default function BookClient({ pages }: { pages: BookingPages }) {
  const router = useRouter();
  const from = useSyncExternalStore(noSubscribe, readFrom, noFrom);
  const link = useMemo(() => resolveBookingLink(from, pages), [from, pages]);

  useEffect(() => {
    if (link.leadChannel) noteLeadChannel(link.leadChannel);
  }, [link.leadChannel]);

  return (
    <BookingModal
      isOpen
      // Read when the form is sent, by which time the route change that
      // brought the visitor here has been recorded.
      bookedFrom={() => link.bookedFrom ?? routeBefore() ?? window.location.pathname}
      onClose={() => {
        // Anyone arriving here directly has no history to go back to, so a
        // bare router.back() would leave them on a dead page.
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
    />
  );
}
