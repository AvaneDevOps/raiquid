"use client";

import { useRevealOnScroll } from "./use-reveal";

/**
 * "How it works" section of the homepage (screen 01-landing).
 *
 * Lives in src/components/landing/ per CONTRIBUTING.md #3 — see
 * for-businesses-section.tsx for why this isn't route-colocated.
 *
 * "use client" is needed for the scroll-reveal effect below (this is
 * otherwise static copy with no interactivity). Visual embellishment
 * only — no new colors, just existing accent/success tokens at low
 * opacity — and every animated element still renders its final state
 * immediately for reduced-motion users (see use-reveal.ts).
 */

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Business uploads invoice",
    description:
      "A business submits a verified invoice with supporting documents. The buyer receives a confirmation request.",
  },
  {
    number: "02",
    title: "Buyer confirms acceptance",
    description:
      "The buyer formally confirms that goods or services were delivered and the amount is owed.",
  },
  {
    number: "03",
    title: "Invoice becomes investable",
    description: "The accepted invoice is tokenized. Verified investors can fund fractions of it.",
  },
  {
    number: "04",
    title: "Buyer pays, investors earn",
    description:
      "On the original due date, the buyer pays as agreed. Investors receive their amount plus a return.",
  },
];

function StepItem({ step, index }: { step: Step; index: number }) {
  const { ref, isVisible } = useRevealOnScroll<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="relative inline-block">
        <span
          aria-hidden
          className="bg-accent-500/20 absolute -inset-4 -z-10 rounded-full blur-xl"
        />
        <span className="font-display text-accent-500 text-3xl md:text-4xl">{step.number}</span>
      </span>
      <h3 className="text-foreground mt-3 font-semibold">{step.title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.description}</p>
    </li>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-border relative overflow-hidden border-t py-20 md:py-24"
    >
      {/* Ambient background glow — decorative only, sits behind all content. */}
      <div
        aria-hidden
        className="bg-accent-500/10 pointer-events-none absolute -top-32 left-[10%] -z-10 size-[28rem] rounded-full blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6">
        <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          How it works
        </p>
        <h2 className="font-display text-foreground mt-4 max-w-xl text-4xl font-semibold md:text-5xl">
          From invoice to investment in four clear steps.
        </h2>

        <ol className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => (
            <StepItem key={step.number} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
