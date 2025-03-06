import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["sanderssmarthome.synology.me"], // Add your Synology domain here
    formats: ["image/webp", "image/jpeg", "image/png"],
  },
};

export default nextConfig;
