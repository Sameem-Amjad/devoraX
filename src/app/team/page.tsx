import { Metadata } from "next";
import TeamClient from "./TeamClient";

const BASE_URL = "https://thedevorax.tech";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the people behind DevoraX — a multidisciplinary team of engineers, designers, and DevOps specialists building the world's next digital products.",
  keywords: [
    "DevoraX team",
    "software development team",
    "React Native engineers",
    "Next.js developers",
    "AI engineers",
    "Pakistan tech team",
    "remote development team",
    "full-stack engineers",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/team`,
    siteName: "DevoraX",
    title: "Our Team | DevoraX",
    description:
      "Meet the people behind DevoraX — a multidisciplinary team of engineers, designers, and DevOps specialists building the world's next digital products.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "DevoraX Team" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@devorax_agency",
    creator: "@devorax_agency",
    title: "Our Team | DevoraX",
    description:
      "Meet the people behind DevoraX — engineers, designers, and DevOps specialists.",
    images: [{ url: `${BASE_URL}/og-image.jpg`, alt: "DevoraX Team" }],
  },
  alternates: {
    canonical: `${BASE_URL}/team`,
  },
};

export default function TeamPage() {
  return <TeamClient />;
}
