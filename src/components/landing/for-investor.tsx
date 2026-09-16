"use client";

import { motion, type Variants } from "framer-motion";
import { InvestmentCard } from "./investorCard";
import { Button } from "@/components/shared/ui/button";

import type { InvestmentOpportunity } from "@/types/investor";
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25 },
  },
};

const opportunities: InvestmentOpportunity[] = [
  {
    company: "Distify Distribution Ltd",
    available: "₦650,000",
    returnRate: "6.5%",
    due: "42 days",
    tierType: "carried",
  },
  {
    company: "MTN Retail Partners",
    available: "₦200,000",
    returnRate: "5.8%",
    due: "28 days",
    tierType: "anchored",
  },
];
const investorBenefits: string[] = [
  "Start with as little as ₦10,000",
  "Invest in invoices accepted by verified buyers",
  "Clear return before you invest",
  "Track repayment in real time",
];

export function InvestorSection() {
  return (
    <section
      id="for-investors"
      className="from-accent-600/10 via-bg to-bg relative bg-linear-to-br px-6 py-20 transition md:px-12 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left investor card */}
        <motion.div
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {opportunities.map((investment) => (
            <InvestmentCard key={investment.company} investment={investment} />
          ))}
        </motion.div>

        {/* Right investor side */}
        <div className="max-w-xl">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
            For investors
          </p>

          <h2 className="font-display text-foreground mt-4 text-3xl leading-[1.1] font-semibold md:text-5xl">
            Invest in real, verified business activity.
          </h2>

          <p className="text-muted-foreground mt-6 text-base leading-7 md:text-lg">
            Every opportunity on Raiquid is backed by an invoice the buyer has formally confirmed
            they owe. You&apos;re not speculating on price — you&apos;re participating in verified
            economic activity.
          </p>

          <InvestorBenefits benefits={investorBenefits} />

          <Button variant="primary" size="lg" className="mt-8">
            Start investing
          </Button>
        </div>
      </div>
    </section>
  );
}

interface InvestorBenefitsProps {
  benefits: string[];
}

export function InvestorBenefits({ benefits }: InvestorBenefitsProps) {
  return (
    <ul className="mt-7 space-y-4">
      {benefits.map((benefit) => (
        <li
          key={benefit}
          className="text-muted-foreground flex items-start gap-3 text-sm md:text-base"
        >
          <span className="text-success mt-0.5">✓</span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
