import type { ReactNode } from "react";
import { LandingHeader } from "@/components/shared/layout/landing-header";
import { LandingFooter } from "@/components/shared/layout/landing-footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
