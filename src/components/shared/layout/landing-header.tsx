import Link from "next/link";
import { Hexagon } from "lucide-react";
import { LANDING_NAV } from "@/lib/nav-config";
import { Button } from "@/components/shared/ui/button";

export function LandingHeader() {
  return (
    <header className="border-border border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-display text-foreground inline-flex items-center gap-2 text-lg font-semibold"
        >
          <Hexagon className="text-accent-400 size-5" strokeWidth={1.75} />
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
