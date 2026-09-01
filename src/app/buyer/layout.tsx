import type { ReactNode } from "react";

// TODO: implement shell. See docs/DESIGN_SYSTEM.md for the intended
// layout (sidebar+bottom-tabs / admin top-tabs / standalone-card) and
// docs/ROUTE_MAP.md for which shell this route group uses.
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
