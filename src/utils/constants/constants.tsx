// --- Configuration & Data ---

import { Cpu, Layout, Server, Smartphone, ShoppingCart, Database, GitBranch, Shield } from "lucide-react";

const AGENCY_NAME = "Devora";
const CEO_NAME = "Sameem Amjad";
const PRIMARY_GRADIENT = "from-cyan-400 via-teal-400 to-emerald-400";
const GLOW_COLOR = "group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)]";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "FinTech Mobile App",
    category: "React Native & Node.js",
    description: "A cross-platform banking application processing 50k+ daily transactions with 99.9% uptime.",
    image: "linear-gradient(135deg, #022c22 0%, #115e59 100%)",
    accent: "from-teal-400 to-emerald-400"
  },
  {
    id: 2,
    title: "AI E-Commerce Ecosystem",
    category: "Next.js & Microservices",
    description: "Scalable multi-vendor marketplace with AI-driven recommendations built on Docker/K8s.",
    image: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    accent: "from-cyan-400 to-blue-500"
  },
  {
    id: 3,
    title: "Predictive Analytics Dashboard",
    category: "MERN Stack",
    description: "Real-time data visualization platform using ML models to predict market trends.",
    image: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    accent: "from-emerald-400 to-cyan-400"
  }
];

const SERVICES = [
  { title: "Mobile Innovation", icon: <Smartphone className="w-6 h-6" />, desc: "High-performance React Native & Flutter apps." },
  { title: "AI & Full-Stack Web", icon: <Cpu className="w-6 h-6" />, desc: "Next.js, Python, & Intelligent Web Solutions." },
  { title: "Cloud Architecture", icon: <Server className="w-6 h-6" />, desc: "Scalable AWS, Docker, & Kubernetes infrastructure." },
  { title: "Modern UI/UX", icon: <Layout className="w-6 h-6" />, desc: "Futuristic interfaces & Design Systems." },
];

const EXTENDED_SERVICES = [
  {
    title: "Mobile App Development",
    icon: "Smartphone",
    desc_text: "Cross-platform iOS & Android applications built with React Native and Flutter. Buttery-smooth performance, offline-first architecture, and App Store-ready delivery.",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    gradient: "from-teal-500 to-emerald-500",
    glow: "rgba(20,184,166,0.3)",
  },
  {
    title: "AI & Full-Stack Web",
    icon: "Cpu",
    desc_text: "Intelligent web platforms powered by Next.js and Python AI/ML pipelines. From LLM integrations to real-time dashboards, we build systems that think.",
    tags: ["Next.js", "Python", "OpenAI", "LangChain"],
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.3)",
  },
  {
    title: "Cloud & DevOps",
    icon: "Server",
    desc_text: "Enterprise-grade infrastructure on AWS, GCP, and Azure. Fully automated CI/CD, containerized microservices, and 99.99% SLA guarantees.",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    gradient: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    title: "UI/UX Design Systems",
    icon: "Layout",
    desc_text: "Pixel-perfect, brand-consistent design systems built to scale. We transform complex workflows into intuitive, delightful user experiences.",
    tags: ["Figma", "Tailwind", "shadcn/ui", "Framer"],
    gradient: "from-pink-500 to-rose-500",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    title: "E-Commerce Solutions",
    icon: "ShoppingCart",
    desc_text: "High-conversion online stores with AI recommendations, multi-currency checkout, real-time inventory, and headless CMS architecture.",
    tags: ["Shopify", "Next.js", "Stripe", "Algolia"],
    gradient: "from-orange-500 to-amber-500",
    glow: "rgba(249,115,22,0.3)",
  },
  {
    title: "Data & Analytics",
    icon: "Database",
    desc_text: "Turn raw data into competitive advantage. We build real-time analytics pipelines, BI dashboards, and predictive ML models that drive decisions.",
    tags: ["Python", "PostgreSQL", "Grafana", "dbt"],
    gradient: "from-emerald-500 to-cyan-500",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    title: "API & Integrations",
    icon: "GitBranch",
    desc_text: "Seamlessly connect any tech stack. RESTful & GraphQL APIs, third-party integrations, webhooks, and event-driven microservice architectures.",
    tags: ["REST", "GraphQL", "Webhooks", "gRPC"],
    gradient: "from-sky-500 to-indigo-500",
    glow: "rgba(14,165,233,0.3)",
  },
  {
    title: "Cybersecurity & Compliance",
    icon: "Shield",
    desc_text: "Security-first development with penetration testing, SOC 2 readiness, GDPR compliance, and zero-trust architecture to protect your users.",
    tags: ["OWASP", "SOC 2", "GDPR", "Pen Testing"],
    gradient: "from-red-500 to-orange-500",
    glow: "rgba(239,68,68,0.3)",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We deep-dive into your vision, user needs, and competitive landscape. Every great product starts with the right questions.",
    icon: "🔍",
    color: "teal",
  },
  {
    number: "02",
    title: "Architect",
    description: "Our engineers design a scalable system blueprint — choosing the right stack, data models, and infrastructure patterns before a single line of code.",
    icon: "🏗️",
    color: "cyan",
  },
  {
    number: "03",
    title: "Build",
    description: "Agile sprints with weekly demos. You stay in the loop as we ship tested, production-ready features with clear milestones.",
    icon: "⚡",
    color: "emerald",
  },
  {
    number: "04",
    title: "Launch",
    description: "Zero-downtime deployments, performance audits, and go-live support. We treat launch day as the beginning, not the end.",
    icon: "🚀",
    color: "blue",
  },
  {
    number: "05",
    title: "Scale",
    description: "Post-launch monitoring, feature iteration, and infrastructure scaling. We're your long-term engineering partner, not just a vendor.",
    icon: "📈",
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
    features: ["Discovery Workshop", "Core Feature Development", "Modern UI Design", "1 Month Support"],
    cta: "Start Your MVP",
    highlight: false
  },
  {
    name: "Growth & Scale",
    price: "$7,500",
    period: "/ starting",
    description: "Robust solutions for growing tech businesses.",
    features: ["Advanced Architecture", "Cross-Platform Mobile App", "Scalable Backend (AWS)", "3 Months Support"],
    cta: "Scale Now",
    highlight: true
  },
  {
    name: "Enterprise Transformation",
    price: "Custom",
    period: "",
    description: "End-to-end digital transformation with dedicated teams.",
    features: ["Dedicated Team", "Microservices Architecture", "24/7 DevOps Monitoring", "Long-term SLA"],
    cta: "Contact Sales",
    highlight: false
  }
];

const TESTIMONIALS = [
  {
    name: "Alex Johnson",
    role: "CTO, FinStart",
    text: "Devora delivered our mobile app 2 weeks ahead of schedule. The code quality and scalability are world-class.",
    avatar: "A",
    company: "FinStart",
    result: "2 weeks early delivery"
  },
  {
    name: "Maria Garcia",
    role: "Founder, ShopFlow",
    text: "Sameem and his team completely transformed our legacy backend into a modern, cloud-native architecture.",
    avatar: "M",
    company: "ShopFlow",
    result: "300% performance boost"
  },
  {
    name: "David Chen",
    role: "Product Owner, TechCorp",
    text: "The best dev shop we've worked with. Their expertise in both AI and DevOps is a game changer.",
    avatar: "D",
    company: "TechCorp",
    result: "Shipped in 6 weeks"
  }
];

export default {
  AGENCY_NAME,
  CEO_NAME,
  PRIMARY_GRADIENT,
  GLOW_COLOR,
  PORTFOLIO_ITEMS,
  SERVICES,
  EXTENDED_SERVICES,
  PROCESS_STEPS,
  TECH_STACK,
  PRICING_PLANS,
  TESTIMONIALS
}
