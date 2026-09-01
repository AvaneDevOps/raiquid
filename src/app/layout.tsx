import type { ReactNode } from "react";
import "./globals.css";

// TODO: fonts, <html>/<body> attributes, metadata. See docs/DESIGN_SYSTEM.md.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
