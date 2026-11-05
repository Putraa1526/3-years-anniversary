import type { NextConfig } from "next";

/**
 * Next.js config for "Diraa & Pupaa — Our Little Universe".
 *
 * This site runs as a full Node server (Next.js App Router + API routes +
 * Prisma SQLite) — perfect for free hosting on Vercel, which supports
 * server-side rendering, API routes, and a persistent database file.
 *
 * All editable content, love notes, and the song are stored in the
 * SQLite database (db/custom.db) and shared across every visitor and
 * device. Edits made from the in-site admin panel persist on the
 * server, so Diraa sees them on her phone, etc.
 *
 * See DEPLOY.md for the Vercel deploy steps.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Hide the Next.js dev tools indicator (the "N" badge).
  devIndicators: false,
};

export default nextConfig;
