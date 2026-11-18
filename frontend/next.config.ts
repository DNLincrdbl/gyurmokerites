import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const api = process.env.API_URL || "http://127.0.0.1:4000";
    return [{ source: "/gyurmo-api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
