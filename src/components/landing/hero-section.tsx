"use client";

import Image from "next/image";
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
  const { ref: imageRef, isVisible: imageVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: statsRef, isVisible: statsVisible } = useRevealOnScroll<HTMLDivElement>();

  return (
    <section className="border-border relative overflow-hidden border-b">
      {/* Ambient background glow — decorative only, sits behind all content. */}
      <div
        aria-hidden
        className="bg-accent-500/10 pointer-events-none absolute -top-32 right-[4%] -z-10 size-112 rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div
            ref={copyRef}
            className={`max-w-xl transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
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

          {/* Right: image */}
          <div
            ref={imageRef}
            className={`relative transition-all delay-100 duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              imageVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {/* Soft glow behind the image */}
            <div
              aria-hidden
              className="bg-accent-500/15 pointer-events-none absolute -inset-6 -z-10 rounded-4xl blur-2xl"
            />

            <div className="border-border overflow-hidden rounded-2xl border shadow-2xl shadow-black/10">
              <Image
                src="/hero.png"
                alt="Dashboard showing verified invoices being funded by investors"
                width={729}
                height={407}
                priority
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Floating badge overlay */}
            <div className="border-border-strong bg-surface absolute -bottom-5 left-6 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg">
              <span aria-hidden className="bg-success size-2 rounded-full" />
              <div className="leading-tight">
                <p className="text-foreground text-sm font-semibold">Invoice funded</p>
                <p className="text-muted-foreground text-xs">₦12.5M · settled in 42 days</p>
              </div>
            </div>
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
