import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statically typed <Link href> and typed route helpers (PageProps,
  // LayoutProps) across the app — see any page.tsx for usage.
  typedRoutes: true,

  allowedDevOrigins: ["10.64.104.66"], // For better viewing of the project via the Network

  images: {
    // Add real remote hosts here once avatars / uploaded documents are
    // served from storage (e.g. S3/R2). Left empty deliberately: do not
    // widen this to a wildcard.
    remotePatterns: [],
  },
};

export default nextConfig;
