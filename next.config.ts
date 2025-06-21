import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.linkedin.com', 'media.licdn.com'],
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV !== "development",
  // },
};

export default nextConfig;
