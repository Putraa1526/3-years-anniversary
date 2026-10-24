import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Hide the Next.js dev tools indicator (the "N" badge in the
  // bottom-left corner) so it doesn't appear on the romantic site.
  devIndicators: false,
};

export default nextConfig;
