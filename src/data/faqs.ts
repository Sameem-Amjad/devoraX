/**
 * The general questions: /contact renders them and llms.txt lists them.
 *
 * Until 11 Nov 2026 they were also the homepage FAQ. The homepage now shows
 * each service's own six questions in tabs (data/homeFaqs.ts, which also
 * builds its FAQPage node), and these ten stay on /contact. faqPageSchema
 * below is no longer emitted by any page; it is kept for a page that shows
 * these questions and wants their markup.
 *
 * Answers use the content files' text format (lib/richText.ts): a link is
 * written [anchor](/path). The homepage and /contact render them with
 * InlineText; the JSON-LD and llms.txt take plainText(), the words a reader
 * sees, so the two still match.
 */
import { SITE_URL } from "@/data/brand";
import { plainText } from "@/lib/richText";

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "My app was built with Lovable, Replit, Bolt or Cursor and it's stuck. Can you finish it?",
    a: "Yes, that is the main thing we do. Start with a free 30-minute call. If it makes sense, a launch-readiness audit reviews your code, database security, payments, hosting and store readiness, and you keep the written report. The fix is then a fixed-price finish sprint, usually 1–2 weeks, followed by payments and the iOS and Android launch if you need them.",
  },
  {
    q: "My marketplace runs on Sharetribe. Can you build the mobile app?",
    a: "Yes. Sharetribe does not ship a native mobile app, so we build one on top of your marketplace: a full React Native build for iOS and Android, quoted in $1,200 sprint weeks after the $400 audit, which is credited to it. We also add the custom Sharetribe features you need. Feature work starts with the audit when your marketplace already runs custom code; Sharetribe Web Template work with no custom code is quoted from your requirements. Our Payments step is only for a marketplace moving off Sharetribe's built-in payments, and [most Sharetribe marketplaces don't need it](/solutions/sharetribe-developers#payouts): those payments already pay sellers through Stripe Connect.",
  },
  {
    q: "How long does it take to build a product with DevoraX?",
    a: "New-build timing is set in the proposal, once the scope is agreed; we don't publish build timelines, because they depend on what you're building. A finish sprint on an app you already have usually takes 1–2 weeks, and the audit says how many sprint weeks the fix needs before work starts. An iOS and Android launch from $2,400 is two weeks of our work, then the outside waits: a D-U-N-S Number if you publish as a company, Google Play's closed test for a new personal account, and App Review.",
  },
  {
    q: "How much does a project cost?",
    a: "Already have an app? Most work starts with the $400 audit, credited to the fix. Two exceptions: Sharetribe Web Template work with no custom code is quoted from your requirements, and a payments-only fix can be quoted on the free call. The fix is a finish sprint at $1,200 per week, usually one or two weeks. Stripe payments start at $1,200 (marketplace payouts from $2,400) and an iOS and Android launch from $2,400, billed like sprints in $1,200 weeks. Monthly care after launch is $1,500 a month, or a single release is quoted per change. For a new build, our MVP Starter package begins at $2,900, Growth projects from $7,500, and Enterprise work is custom-scoped. Either way there is no hourly billing and no surprise invoices: if the work takes longer than the audit or the written quote estimated, we finish the agreed scope at no extra cost. What we quote is what you pay.",
  },
  {
    q: "Do I own the code and IP when the project is done?",
    a: "100%. Full source code, all assets, and all intellectual property transfer to you on final payment. Your app also runs on your own accounts by default: the Apple and Google developer accounts, Stripe and hosting. If you ask us to hold one for you, we transfer it to you at handover. For the App Store and Google Play, that means moving the app to your own developer account. We also hand over clean documentation and onboarding materials so your internal team can take over confidently.",
  },
  {
    q: "Can you work with our existing codebase or team?",
    a: "Yes. We can work inside your existing codebase and alongside your engineers: code reviews, new features, refactoring legacy code, or taking over ownership. We adapt to your workflow, not the other way around.",
  },
  {
    q: "What happens after launch?",
    a: "New builds on the MVP Starter and Growth & Scale packages include 35 days of free maintenance after launch, for real problems: bugs in what we built. A finish sprint, payments work or an iOS and Android launch carries the same 35 days: defects in the work we delivered are fixed free for 35 days after handover. New features are quoted separately. After that, ongoing fixes, updates and releases are covered by the $1,500/month care plan, or a single release is quoted per change.",
  },
  {
    q: "How do you handle project communication?",
    a: "Every week you get a video demo of progress and a short written update. You also get a shared project board (Jira, Linear, Trello or similar) and a Slack or WhatsApp channel with Sameem and Usman, the engineers doing the work. DevoraX is a two-person studio, so there is no account manager in between.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, on request before any discovery call. We treat every client's business model, technical specs, and proprietary information as strictly confidential, regardless of whether an NDA is in place.",
  },
  {
    q: "Can you help if we only have an idea and no specs yet?",
    a: "Yes. Our Discovery Workshop is designed for this: we help you define requirements, map user journeys, choose the right tech stack, and produce a full product spec, all before development starts.",
  },
];

/**
 * When the answers above last changed: the homepage and /contact print them.
 * 8 Nov 2026: check-ins as confirmed, the accounts default, the Sharetribe
 * Payments step and app build, the launch's weeks and billing, the overrun
 * term on every written quote, and one release quoted per change.
 */
export const FAQS_UPDATED = "2026-11-08T00:00:00.000Z";

/**
 * FAQPage node for the homepage graph, built from the exact Q&As rendered on
 * the page. No @context: it is one node in the page's @graph. The @id is the
 * homepage URL plus the anchor of <FAQSection />, so it names a real location.
 */
export const faqPageSchema = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: plainText(a) },
  })),
};
