"use client";

/* Standalone wrapper for the booking modal.
 *
 * The modal was only reachable by clicking a button on the homepage, so there
 * was no URL that meant "book a call" — nothing to link from the portfolio, an
 * email signature or a proposal. This gives it one.
 *
 * It reuses the same component rather than forking the UI, so there is one
 * booking flow to keep correct, not two.
 */

import { useRouter } from "next/navigation";
import BookingModal from "@/components/models/bookingModel/bookingModel";

export default function BookClient() {
  const router = useRouter();

  return (
    <BookingModal
      isOpen
      onClose={() => {
        // Anyone arriving here directly has no history to go back to, so a
        // bare router.back() would leave them on a dead page.
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
    />
  );
}
