import type { ReactNode } from "react";

// No shared chrome: the exports show /confirm/* (13,14) as a chromeless
// centered <StandaloneShell> card, while /auth and /verify (02,03) sit
// under the marketing <LandingHeader> (no footer). Each page composes
// its own — see docs/DESIGN_SYSTEM.md, "Layout shells".
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
