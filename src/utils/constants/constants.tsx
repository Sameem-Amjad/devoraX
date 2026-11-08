// --- Configuration & Data ---

import { Search, Layers, Code2, Rocket, TrendingUp } from "lucide-react";

// The brand is DevoraX — the domain, the Organization schema `name`, the logo
// and every case study say so. This constant said "Devora", which is what the
// hero, the about section and the logo rendered, so the homepage referred to the
// company by one name seven times and by its actual name three times. Brand
// mentions are the single strongest correlate for being surfaced by generative
// engines, and splitting them across two spellings splits the signal.
const AGENCY_NAME = "DevoraX";
const CEO_NAME = "Sameem Amjad";
const PRIMARY_GRADIENT = "from-cyan-400 via-teal-400 to-emerald-400";
const GLOW_COLOR = "group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)]";

// PORTFOLIO_ITEMS, removed on 8 Nov 2026, was never imported. It still held
// claims the site has no source for ("AI-driven recommendations built on
// Docker/K8s", "ML models to predict market trends"). The portfolio is the
// projects table, shown on /projects.

// The homepage's service cards are the three door pages and the marketplace
// hub (data/offer.ts, joined to their pages in data/siteNav.ts). SERVICES and
// EXTENDED_SERVICES, removed on 7 Nov 2026, padded that grid to eight cards
// with services no page sells: "E-Commerce Solutions", "Data & Analytics",
// "API & Integrations" and the like.

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We deep-dive into your vision, user needs, and competitive landscape. Every great product starts with the right questions.",
    icon: <Search className="w-6 h-6" />,
    color: "teal",
  },
  {
    number: "02",
    title: "Architect",
    description: "Our engineers design a scalable system blueprint, choosing the right stack, data models, and infrastructure patterns before a single line of code.",
    icon: <Layers className="w-6 h-6" />,
    color: "cyan",
  },
  {
    number: "03",
    title: "Build",
    // The four check-in practices confirmed on 8 Nov 2026, and nothing more.
    description: "Sprints with a video demo of progress and a short written update every week, a shared project board, and a Slack or WhatsApp channel with Sameem and Usman.",
    icon: <Code2 className="w-6 h-6" />,
    color: "emerald",
  },
  {
    number: "04",
    title: "Launch",
    description: "Deployment, performance checks and go-live support. We treat launch day as the beginning, not the end.",
    icon: <Rocket className="w-6 h-6" />,
    color: "blue",
  },
  {
    number: "05",
    title: "Scale",
    description: "Post-launch monitoring, feature iteration, and infrastructure scaling. After launch we stay on for fixes and new releases if you want us: monthly care, or a single release quoted per change.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "violet",
  },
];

const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Flutter",
  "React Native", "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB",
  "Redis", "GraphQL", "Tailwind CSS", "Framer Motion", "Prisma", "Supabase",
  "Vercel", "Stripe", "OpenAI", "LangChain", "Terraform", "GitHub Actions",
];

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
  CEO_NAME,
  PRIMARY_GRADIENT,
  GLOW_COLOR,
  PROCESS_STEPS,
  TECH_STACK,
  PRICING_PLANS
};

export default CONSTANTS;
