"use client";

/* Withdrawing consent has to be as easy as giving it: this reopens the
 * analytics banner. The only client piece of the footer. analyticsEnabled is
 * a build-time flag, so the server render and the client agree. */

import { analyticsEnabled, openPrivacyChoices } from "@/lib/analytics";

export function PrivacyChoicesButton({ className }: { className?: string }) {
  if (!analyticsEnabled) return null;
  return (
    <button type="button" onClick={openPrivacyChoices} className={className}>
      Privacy choices
    </button>
  );
}
