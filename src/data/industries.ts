/**
 * The industries a project can belong to, and which industry each project is in.
 *
 * The industry line on each project card, the filter chips on /projects, the
 * chip on a project page and the homepage's industry cards all read this file,
 * so they can never disagree. Kept in code, like the long-form case studies,
 * and keyed by the project's `slug`; a project missing here shows no industry.
 *
 * An industry belongs here only when a real project in the portfolio is in it,
 * the same rule the homepage's industry cards follow.
 */
export type Industry = { slug: string; label: string };

export const INDUSTRIES = [
  { slug: 'real-estate', label: 'Real Estate & Construction' },
  { slug: 'marketplaces', label: 'Marketplaces & E-Commerce' },
  { slug: 'food-hospitality', label: 'Food & Hospitality' },
  { slug: 'education', label: 'Education' },
  { slug: 'media', label: 'Media, Marketing & Creators' },
  { slug: 'legal-finance', label: 'Legal, Finance & Web3' },
  { slug: 'health', label: 'Health & Wellbeing' },
  { slug: 'fitness', label: 'Fitness & Sport' },
  { slug: 'workforce', label: 'Field & Workforce' },
  { slug: 'travel', label: 'Travel' },
] as const satisfies readonly Industry[];

export type IndustrySlug = (typeof INDUSTRIES)[number]['slug'];

/** Project slug (projects.slug) → its industry. */
const PROJECT_INDUSTRY: Record<string, IndustrySlug> = {
  // Real estate & construction
  constraction: 'real-estate',
  sitewrite: 'real-estate',
  idecorwala: 'real-estate',
  'bevy-irie': 'real-estate',
  'cad-interior-studio': 'real-estate',
  // Marketplaces & e-commerce
  'ai-ecommerce-ecosystem': 'marketplaces',
  'bondly-pet-care': 'marketplaces',
  'ginger-ecommerce': 'marketplaces',
  agrobridge: 'marketplaces',
  'pastel-marketplace': 'marketplaces',
  'dooz-inspected-cars': 'marketplaces',
  'afriva-e-commerce-platform': 'marketplaces',
  triagely: 'marketplaces',
  // Food & hospitality (VoiceDesk's demo agents run a hotel and a restaurant)
  'food-magnet-vendor': 'food-hospitality',
  'koor-food-delivery': 'food-hospitality',
  'coffee-shop-web-app': 'food-hospitality',
  'waitmate-platform': 'food-hospitality',
  voicedesk: 'food-hospitality',
  'royal-malt': 'food-hospitality',
  // Education
  'pathana-platform': 'education',
  firstpass: 'education',
  'pianissimo-online': 'education',
  'steamblast-arena': 'education',
  // Media, marketing & creators
  'ai-art-platform': 'media',
  'three28-creator-platform': 'media',
  'loopedin-platform': 'media',
  'juju-streaming-platform': 'media',
  'hear-with-you': 'media',
  'expertprofile-ai': 'media',
  'mint-choc-media': 'media',
  // Legal, finance & Web3
  'fintech-mobile-app': 'legal-finance',
  'predictive-analytics-dashboard': 'legal-finance',
  'digital-power-of-attorney-platform': 'legal-finance',
  solnotary: 'legal-finance',
  // Health & wellbeing
  'ar-lip-filler': 'health',
  gentler: 'health',
  // Fitness & sport
  'augment-fit-platform': 'fitness',
  'wod-pro-league': 'fitness',
  // Field & workforce
  'cedmat-roller-shutter-app': 'workforce',
  'tal-workforce-platform': 'workforce',
  // Travel
  'barfly-risk-engine': 'travel',
};

export function getIndustry(slug: unknown): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

/** The industry a project is in, from its row. */
export function projectIndustry(project: { slug?: unknown }): Industry | undefined {
  return typeof project.slug === 'string' ? getIndustry(PROJECT_INDUSTRY[project.slug]) : undefined;
}

/** /projects showing one industry. The homepage cards and project pages link here. */
export const industryHref = (slug: string): string => `/projects?industry=${slug}`;
