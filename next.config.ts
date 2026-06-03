import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enforces a static HTML export
  images: {
    unoptimized: true, // Required because GitHub Pages can't optimize images on the fly
  },
};

export default nextConfig;
