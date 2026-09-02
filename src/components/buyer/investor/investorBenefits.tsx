interface InvestorBenefitsProps {
  benefits: string[];
}

export function InvestorBenefits({ benefits }: InvestorBenefitsProps) {
  return (
    <ul className="mt-7 space-y-4">
      {benefits.map((benefit) => (
        <li key={benefit} className="flex items-start gap-3 text-sm text-[#d5cec1] md:text-base">
          <span className="mt-0.5 text-[#72b28b]">✓</span>

          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
