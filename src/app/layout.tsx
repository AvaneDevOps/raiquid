import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * Type: Fraunces (display), IBM Plex Sans (body/UI), IBM Plex Mono
 * (ids / data / chips) — the "Ledger of Stone" families. See
 * docs/DESIGN_SYSTEM.md, "Typography". Each call exposes a CSS variable
 * consumed by the Tailwind theme in globals.css.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  fallback: ["ui-serif", "Georgia", "serif"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "Raiquid",
    template: "%s · Raiquid",
  },
  description: "Tokenized invoice financing for Nigerian SMEs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
