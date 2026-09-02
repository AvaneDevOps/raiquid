import { opportunities as InvestmentOpportunity, investorBenefits } from "./index";

import { InvestmentCard } from "./investorCard";
import { InvestorBenefits } from "./investorBenefits";
import { Button } from "@/components/shared/ui/button";

export default function InvestorSection() {
  return (
    <section className="bg-[#] px-6 py-20 md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* =========================
            LEFT — INVESTMENT CARDS
        ========================== */}
        <div className="space-y-4">
          {InvestmentOpportunity.map((investment) => (
            <InvestmentCard key={investment.company} investment={investment} />
          ))}
        </div>

        {/* =========================
            RIGHT — INVESTOR CONTENT
        ========================== */}
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="font-mono text-xs tracking-[0.2em] text-[#746d61] uppercase">
            For investors
          </p>

          {/* Heading */}
          <h2 className="mt-4 font-serif text-2xl leading-[1.1] font-semibold text-[#eee5d7] md:text-3xl">
            Invest in real, verified business activity.
          </h2>

          {/* Description */}
          <p className="mt-6 text-base leading-7 text-[#918a7d] md:text-lg">
            Every opportunity on Rayquid is backed by an invoice the buyer has formally confirmed
            they owe. You&apos;re not speculating on price — you&apos;re participating in verified
            economic activity.
          </p>

          {/* Benefits */}
          <InvestorBenefits benefits={investorBenefits} />

          {/* CTA */}
          <Button variant="primary" size="lg" className="mt-8">
            Start investing
          </Button>
        </div>
      </div>
    </section>
  );
}
