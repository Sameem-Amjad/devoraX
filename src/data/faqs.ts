/**
 * Single source of truth for the homepage FAQ.
 *
 * Both the visible <FAQSection /> and the server-rendered FAQPage JSON-LD read
 * from this array. Structured data must describe content that is actually
 * visible on the page, so keeping one array prevents the two from drifting.
 */
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "How long does it take to build a product with Devora?",
    a: "It depends on scope, but our typical timeline is 4–6 weeks for an MVP, 8–16 weeks for a full-featured product, and 3–6 months for enterprise-grade platforms. After a free discovery call, we provide a detailed project timeline alongside a fixed-price proposal.",
  },
  {
    q: "How much does a project cost?",
    a: "Our MVP Starter package begins at $2,900, Growth projects from $7,500, and Enterprise work is custom-scoped. Every project gets a fixed-price proposal after the discovery call — no hourly billing, no surprise invoices. What we quote is what you pay.",
  },
  {
    q: "Do I own the code and IP when the project is done?",
    a: "100%. Full source code, all assets, and all intellectual property transfer to you on final payment. We also hand over clean documentation and onboarding materials so your internal team can take over confidently.",
  },
  {
    q: "Can you work with our existing codebase or team?",
    a: "Absolutely. We regularly embed within existing engineering teams as an extension squad — performing code reviews, adding new features, refactoring legacy systems, or taking over full ownership. We adapt to your workflow, not the other way around.",
  },
  {
    q: "What happens after launch?",
    a: "All plans include post-launch support. Starter gets 1 month, Growth gets 3 months, and Enterprise is covered by a long-term SLA. After the included period, we offer ongoing retainer packages for continued development, monitoring, and optimization.",
  },
  {
    q: "How do you handle project communication?",
    a: "You get direct Slack access to your team, weekly video demos of progress, a shared project board (Jira or Linear), and a dedicated project manager as your single point of contact. You'll never wonder what's happening — we over-communicate by design.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, on request before any discovery call. We treat every client's business model, technical specs, and proprietary information as strictly confidential, regardless of whether an NDA is in place.",
  },
  {
    q: "Can you help if we only have an idea — no specs yet?",
    a: "That's actually where we excel. Our Discovery Workshop is designed exactly for this: we help you define requirements, map user journeys, choose the right tech stack, and produce a full product spec — all before development starts.",
  },
];

/** FAQPage JSON-LD built from the exact Q&As rendered on the page. */
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
