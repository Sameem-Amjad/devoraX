"use client";

import { useEffect, useState } from "react";

interface Props {
  user: string;
  domain: string;
  className?: string;
}

/**
 * Renders an email address only on the client after hydration.
 * Bots scraping the SSR'd HTML will not see the full address.
 */
export function ObfuscatedEmail({ user, domain, className }: Props) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    return (
      <span className={className} aria-label="email address">
        [loading…]
      </span>
    );
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
