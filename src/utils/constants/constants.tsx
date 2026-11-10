// --- Configuration & Data ---

// The brand is DevoraX — the domain, the Organization schema `name`, the logo
// and every case study say so. This constant said "Devora", which is what the
// hero, the about section and the logo rendered, so the homepage referred to the
// company by one name seven times and by its actual name three times. Brand
// mentions are the single strongest correlate for being surfaced by generative
// engines, and splitting them across two spellings splits the signal.
const AGENCY_NAME = "DevoraX";

// PORTFOLIO_ITEMS, removed on 8 Nov 2026, was never imported. It still held
// claims the site has no source for ("AI-driven recommendations built on
// Docker/K8s", "ML models to predict market trends"). The portfolio is the
// projects table, shown on /projects.

// The homepage's service cards are the three door pages and the marketplace
// hub (data/offer.ts, joined to their pages in data/siteNav.ts). SERVICES and
// EXTENDED_SERVICES, removed on 7 Nov 2026, padded that grid to eight cards
// with services no page sells: "E-Commerce Solutions", "Data & Analytics",
// "API & Integrations" and the like.

// PROCESS_STEPS and TECH_STACK, removed on 10 Nov 2026 with the sections that
// printed them. The five generic steps ("Discover, Architect, Build, Launch,
// Scale") gave way to the offer ladder (data/offer.ts), which is the process
// for an app that already exists, and the 24-item technology marquee to the
// stack table (components/sections/stack.tsx), which keeps every tool the
// marquee and the toolbox listed. CEO_NAME, PRIMARY_GRADIENT and GLOW_COLOR
// went with them: nothing read them any more.

const PRICING_PLANS = [
  {
    name: "MVP Starter",
    price: "$2,900",
    period: "/ starting",
    description: "Rapid prototyping to validate your AI or Tech idea.",
    features: ["Discovery Workshop", "Core Feature Development", "Modern UI Design", "35 Days Free Maintenance"],
    // Every plan button goes to /book?from=home, so each says so, in the
    // label every booking link on the site uses.
    cta: "Book a free 30-minute call",
    highlight: false
  },
  {
    name: "Growth & Scale",
    price: "$7,500",
    period: "/ starting",
    description: "For products that have outgrown an MVP.",
    features: ["Advanced Architecture", "Cross-Platform Mobile App", "Scalable Backend (AWS)", "35 Days Free Maintenance"],
    cta: "Book a free 30-minute call",
    highlight: true
  },
  {
    name: "Enterprise Transformation",
    price: "Custom",
    period: "",
    description: "Larger builds scoped in phases. If a phase needs a designer or another specialist, we name them to you before they start.",
    features: ["Both Founders on Your Project", "Microservices Architecture", "Automated Uptime Alerts", "Ongoing Support via the $1,500/mo Care Plan"],
    cta: "Book a free 30-minute call",
    highlight: false
  }
];

// Testimonials moved to src/data/testimonials.ts, sourced from real public Fiverr
// reviews. The three entries that used to live here ("Alex Johnson, CTO,
// FinStart" and similar) were invented people at invented companies, carrying
// invented outcome metrics such as "300% performance boost". Fabricated social
// proof is the fastest way to lose the credibility the rest of the site is
// working to build — and the real reviews are stronger anyway, because a reader
// can check them.

// No HEADER_TITLE: the logo wrote "Devora" from it and drew the X, so the
// header's text said "Devora". components/global/logo.tsx now writes the whole
// name from AGENCY_NAME.
const CONSTANTS = {
  AGENCY_NAME,
  PRICING_PLANS
};

export default CONSTANTS;
