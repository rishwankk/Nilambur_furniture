import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['loremflickr.com'],
    remotePatterns: [
      {
        protocol: "https", // Use the correct protocol for your external images
        hostname: "picsum.photos", // External domain
        port: "", // Default port (empty string is fine)
        pathname: "/**", // All paths under the domain
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
