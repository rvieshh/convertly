import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native-binary packages must stay external so the server bundle requires
  // them at runtime instead of trying to bundle their .node files.
  serverExternalPackages: ["sharp", "better-sqlite3", "bcryptjs"],
};

export default nextConfig;
