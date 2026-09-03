import type { ReactNode } from "react";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <StandaloneShell>{children}</StandaloneShell>;
}
