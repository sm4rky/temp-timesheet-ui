import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/", destination: "/Home", permanent: true }];
  },
};

export default nextConfig;
