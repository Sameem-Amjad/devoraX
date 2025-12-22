import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
};

export default nextConfig;
