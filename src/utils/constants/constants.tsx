// --- Configuration & Data ---

import { Cpu, Layout, Server, Smartphone } from "lucide-react";

const AGENCY_NAME = "Devora";
const CEO_NAME = "Sameem Amjad";
// Updated to match the Teal/Green/Blue vibe of the logo image
const PRIMARY_GRADIENT = "from-cyan-400 via-teal-400 to-emerald-400";
const GLOW_COLOR = "group-hover:shadow-[0_0_25px_rgba(45,212,191,0.5)]";

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: "FinTech Mobile App",
    category: "React Native & Node.js",
    description: "A cross-platform banking application processing 50k+ daily transactions with 99.9% uptime.",
    image: "linear-gradient(135deg, #022c22 0%, #115e59 100%)", // Dark Teal bg
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
    avatar: "A"
  },
  {
    name: "Maria Garcia",
    role: "Founder, ShopFlow",
    text: "Sameem and his team completely transformed our legacy backend into a modern, cloud-native architecture.",
    avatar: "M"
  },
  {
    name: "David Chen",
    role: "Product Owner, TechCorp",
    text: "The best dev shop we've worked with. Their expertise in both AI and DevOps is a game changer.",
    avatar: "D"
  }
];

export default {
  AGENCY_NAME,
  CEO_NAME,
  PRIMARY_GRADIENT,
  GLOW_COLOR,
  PORTFOLIO_ITEMS,
  SERVICES,
  PRICING_PLANS,
  TESTIMONIALS
}