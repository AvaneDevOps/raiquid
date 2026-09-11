"use client";

import Link from "next/link";

import { Button } from "@/components/shared/ui/button";
import { useRevealOnScroll } from "./use-reveal";

interface HeroStat {
  value: string;
  label: string;
}

const STATS: HeroStat[] = [
  { value: "₦2.4B+", label: "Invoices financed" },
  { value: "1,200+", label: "Active investors" },
  { value: "98.2%", label: "Buyer acceptance rate" },
  { value: "42 days", label: "Average funding time" },
];

export function HeroSection() {
  const { ref: copyRef, isVisible: copyVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: statsRef, isVisible: statsVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="border-border relative overflow-hidden border-b">
      {/* Ambient background glow — decorative only, sits behind all content. */}
      <div
        aria-hidden
        className="bg-accent-500/10 pointer-events-none absolute -top-32 right-[4%] -z-10 size-[28rem] rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <div
          ref={copyRef}
          className={`max-w-2xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
            copyVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="border-border-strong bg-surface text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span aria-hidden className="bg-success size-1.5 rounded-full" />
            Built on Brickken blockchain infrastructure
          </p>

          <h1 className="font-display text-foreground mt-6 text-4xl leading-[1.08] font-semibold tracking-[-0.01em] md:text-6xl">
            Turn waiting invoices into{" "}
            <em className="text-accent-400 font-display italic">working capital.</em>
          </h1>

          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed md:text-lg">
            Businesses receive payment early on verified invoices. Investors access transparent,
            real-economy opportunities. All of it backed by buyer acceptance and provenance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/auth">Get started</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/#for-investors">Explore investments</Link>
            </Button>
          </div>
        </div>

        <div
          ref={statsRef}
          className={`transition-all delay-150 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <dl className="border-border mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dd className="font-display text-foreground order-1 text-2xl font-semibold">
                  {stat.value}
                </dd>
                <dt className="text-muted-foreground order-2 text-xs">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
