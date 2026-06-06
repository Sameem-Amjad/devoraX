import type { NextConfig } from "next";

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
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
