"use client";

import { Check, CircleDot, Clock, type LucideIcon } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/shared/ui/card";
import type { ProvenanceItem } from "@/types/provenance";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.35 },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const provenanceItems: ProvenanceItem[] = [
  {
    title: "Acceptance history",
    description:
      "Every invoice a buyer accepts is recorded. Investors can see exactly how many invoices a buyer has confirmed.",
    icon: "check",
  },
  {
    title: "Payment reliability",
    description:
      "On-time payment rates are tracked and visible. A buyer with a strong record represents lower risk.",
    icon: "clock",
  },
  {
    title: "Progressive trust",
    description:
      "Buyers move from Quarried to Carried to Anchored as they pay on time, unlocking higher limits and lower reserve requirements.",
    icon: "trust",
  },
];

export function ProvenanceSection() {
  return (
    <section className="border-border relative overflow-hidden border-t px-6 py-16 md:px-12 lg:px-16">
      {/* Centered glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-175 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,var(--color-accent-600)_0%,transparent_70%)] opacity-10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-xl">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
            Why provenance matters
          </p>

          <h2 className="font-display text-foreground mt-3 text-4xl leading-[1.15] font-semibold md:text-5xl">
            Buyers build a record every time they pay.
          </h2>
        </div>

        <motion.div
          className="mt-7 grid gap-4 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {provenanceItems.map((item) => (
            <ProvenanceCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ProvenanceCard

interface ProvenanceCardProps {
  item: ProvenanceItem;
  className?: string;
}

const icons: Record<string, LucideIcon> = {
  check: Check,
  trust: CircleDot,
  clock: Clock,
};

export function ProvenanceCard({ item, className }: ProvenanceCardProps) {
  const Icon = item.icon ? icons[item.icon] : null;

  return (
    <motion.div variants={cardVariant} className="h-full">
      <Card className={cn("flex h-full flex-col p-5", className)}>
        <CardHeader className="border-0 p-0">
          <div className="bg-surface-raised flex h-8 w-8 items-center justify-center rounded-md">
            {item.emoji ? (
              <span className="text-sm leading-none">{item.emoji}</span>
            ) : (
              Icon && <Icon className="text-accent-400 h-3.5 w-3.5" />
            )}
          </div>

          <CardTitle className="text-foreground mt-3">{item.title}</CardTitle>
        </CardHeader>

        <p className="text-muted-foreground mt-3 text-sm leading-5">{item.description}</p>
      </Card>
    </motion.div>
  );
}
