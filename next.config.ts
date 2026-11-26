import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // used by the Docker image; ignored by Vercel
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
