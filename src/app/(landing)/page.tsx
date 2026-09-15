import { FAQSection, ForBusinessesSection, HowItWorksSection } from "@/components/landing";
import { InvestorSection } from "@/components/landing/for-investor";
import { ProvenanceSection } from "@/components/landing/provenanceSection";

export default function Page() {
  return (
    <>
      <HowItWorksSection />
      <ForBusinessesSection />
      <InvestorSection />
      <ProvenanceSection />
      <FAQSection />
    </>
  );
}
