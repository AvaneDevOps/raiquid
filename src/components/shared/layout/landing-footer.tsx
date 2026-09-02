import Link from "next/link";
import { Hexagon } from "lucide-react";
import { LANDING_NAV } from "@/lib/nav-config";

/**
 * Public site footer — wordmark, section links, sandbox disclaimer,
 * copyright. Used by the (landing) route group.
 */
export function LandingFooter() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="font-display text-foreground inline-flex items-center gap-2 text-base font-semibold">
            <Hexagon className="text-accent-400 size-4 shrink-0" strokeWidth={1.75} />
            Raiquid
          </span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LANDING_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-muted-foreground text-xs">
          Built for the Brickken Developer Build Programme. Runs on the Base Sepolia sandbox — every
          money-moving action is simulated and no real funds move.
        </p>
        <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} Raiquid</p>
      </div>
    </footer>
  );
}
