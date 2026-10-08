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
    q: "My app was built with Lovable, Replit, Bolt or Cursor and it's stuck. Can you finish it?",
    a: "Yes, that is the main thing we do. Start with a free 30-minute call. If it makes sense, a launch-readiness audit reviews your code, database security, payments, hosting and store readiness, and you keep the written report. The fix is then a fixed-price finish sprint, usually 1–2 weeks, followed by payments and the iOS and Android launch if you need them.",
  },
  {
    q: "My marketplace runs on Sharetribe. Can you build the mobile app?",
    a: "Yes. Sharetribe does not ship a native mobile app, so we build the iOS and Android app on top of your marketplace, add the custom Sharetribe features you need, and set up Stripe Connect payouts to your sellers in your own Stripe account. The price is fixed after the audit.",
  },
  {
    q: "How long does it take to build a product with DevoraX?",
    a: "It depends on scope. As a rough estimate, a focused MVP scope often takes 4–6 weeks, a full-featured product 8–16 weeks, and a large platform 3–6 months. These are estimates, not averages from a delivery record. After a free discovery call, we give you a timeline for your scope alongside a fixed-price proposal.",
  },
  {
    q: "How much does a project cost?",
    a: "For an app you already have, the price is fixed after the launch-readiness audit, and the audit fee is credited to the fix if you go ahead. For a new build, our MVP Starter package begins at $2,900, Growth projects from $7,500, and Enterprise work is custom-scoped. Either way there is no hourly billing and no surprise invoices. What we quote is what you pay.",
  },
  {
    q: "Do I own the code and IP when the project is done?",
    a: "100%. Full source code, all assets, and all intellectual property transfer to you on final payment. We also hand over clean documentation and onboarding materials so your internal team can take over confidently.",
  },
  {
    q: "Can you work with our existing codebase or team?",
    a: "Yes. We can work inside your existing codebase and alongside your engineers: code reviews, new features, refactoring legacy code, or taking over ownership. We adapt to your workflow, not the other way around.",
  },
  {
    q: "What happens after launch?",
    a: "All plans include post-launch support. Starter gets 1 month, Growth gets 3 months, and Enterprise is covered by a long-term SLA. After the included period, we offer ongoing retainer packages for continued development, monitoring, and optimization.",
  },
  {
    q: "How do you handle project communication?",
    a: "You talk directly to the engineers doing the work, Sameem or Usman, over Slack or your preferred channel, with weekly video demos of progress and a shared project board (Jira or Linear). DevoraX is a two-person studio, so there is no account manager in between. You'll never wonder what's happening — we over-communicate by design.",
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
