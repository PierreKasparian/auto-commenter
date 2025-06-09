import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.linkedin.com'],
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV !== "development",
  // },
};

export default nextConfig;
