import Link from "next/link";
import { LANDING_NAV } from "@/lib/nav-config";
import { Button } from "@/components/shared/ui/button";

/**
 * Public site header — wordmark, section links, Sign in / Get started.
 * Used by the (landing) route group. Dark theme like everything else.
 */
export function LandingHeader() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-display text-foreground text-lg font-semibold">
          Raiquid
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
