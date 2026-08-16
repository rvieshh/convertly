import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp ships native binaries — keep it external so the server bundle can
  // require it at runtime instead of trying to bundle the .node files.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
