"use client";

/* Feeds lib/booking/visit.ts from the root layout: every route change, so a
 * booking knows the page before /book and the page the visit began on, and
 * every answer to the analytics banner, so the stored landing path and lead
 * channel follow consent both ways. Renders nothing. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onConsentChange } from "@/lib/analytics";
import { noteRoute, syncLandingPath, syncLeadChannel } from "@/lib/booking/visit";

// Both stored values answer to the same banner.
const syncStoredVisit = () => {
  syncLandingPath();
  syncLeadChannel();
};

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) noteRoute(pathname);
  }, [pathname]);

  useEffect(() => onConsentChange(syncStoredVisit), []);

  return null;
}
