import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The same rule as the CSP's frame-ancestors 'none', for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  // A legacy header: "0" turns off the XSS auditor in the old browsers that still
  // have one, since the auditor itself could be abused. The CSP does the real work.
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js hydration + Framer Motion require unsafe-inline. unsafe-eval is
      // for dev HMR only: no production client chunk evaluates strings (the one
      // Function("return this") is core-js's globalThis fallback in the legacy
      // polyfill, never reached in a modern browser), and neither gtag.js nor
      // Clarity needs it.
      // googletagmanager + clarity.ms: GA4 and Clarity, loaded by src/lib/analytics.ts.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://*.clarity.ms`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com" +
        " https://*.google-analytics.com https://*.analytics.google.com https://*.google.com" +
        " https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "arqdtyoiwvhpxkuyettb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // `experimental.optimizeCss` was set to true, but it needs the `critters` /
  // `beasties` package to do anything and that dependency is not installed — so
  // no critical CSS was ever inlined. A flag that silently does nothing is worse
  // than no flag, because it reads as "this is handled". Left off deliberately:
  // the site now ships one stylesheet for one font, which is not worth the
  // build-time cost or the extra dependency.
  //
  // On a dynamically rendered route, Next streams <title>, the description,
  // the canonical and robots tags into <body> after the first byte, unless the
  // user agent is on this list. Its default list (copied below from Next
  // 16.0.10, html-bots.js) has the classic search and link-preview bots but no
  // AI crawler, and AI crawlers read the raw HTML without running JavaScript,
  // expecting that metadata in <head>. Every public page is static today, so
  // this guards the day one is not. Setting the option replaces the default,
  // which is why the default is repeated first.
  htmlLimitedBots: new RegExp(
    [
      "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight",
      "GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|DuckAssistBot|MistralAI-User|Amazonbot|meta-externalagent|CCBot",
    ].join("|"),
    "i"
  ),
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        // Redirect www → non-www (canonical domain)
        source: "/:path*",
        has: [{ type: "host", value: "www.thedevorax.tech" }],
        destination: "https://thedevorax.tech/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
