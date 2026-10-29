import type { NextConfig } from "next";

/**
 * Next.js config for "Diraa & Pupaa — Our Little Universe".
 *
 * This site is built as a fully static export so it can be hosted for
 * free on GitHub Pages (or any static host). All "backend" features
 * (love notes, song, admin edits, photo uploads) use the browser's
 * localStorage instead of a server — see src/lib/storage.ts.
 *
 * ── Deploying to GitHub Pages ──
 * If you publish to a USER or ORG page (https://<name>.github.io/),
 * leave basePath/assetPrefix empty (the default).
 *
 * If you publish to a PROJECT page (https://<name>.github.io/<repo>/),
 * set the NEXT_PUBLIC_BASE_PATH env var to "/<repo>" at build time, e.g.
 *   NEXT_PUBLIC_BASE_PATH=/my-repo bun run build
 * or uncomment the basePath lines below and hardcode your repo name.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No server-side image optimization on static hosting.
    unoptimized: true,
  },
  // Clean URLs that work well on GitHub Pages.
  trailingSlash: true,
  // basePath + assetPrefix for project pages (set NEXT_PUBLIC_BASE_PATH).
  ...(basePath
    ? { basePath, assetPrefix: basePath }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Hide the Next.js dev tools indicator (the "N" badge).
  devIndicators: false,
};

export default nextConfig;
