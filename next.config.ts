// next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // your existing config options here
};

export default withAnalyzer(nextConfig);
