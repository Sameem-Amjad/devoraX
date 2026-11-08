"use client";

/* Feeds lib/booking/visit.ts from the root layout: every route change, so a
 * booking knows the page before /book and the page the visit began on, and
 * every answer to the analytics banner, so the stored landing path follows
 * consent both ways. Renders nothing. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onConsentChange } from "@/lib/analytics";
import { noteRoute, syncLandingPath } from "@/lib/booking/visit";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) noteRoute(pathname);
  }, [pathname]);

  useEffect(() => onConsentChange(syncLandingPath), []);

  return null;
}
