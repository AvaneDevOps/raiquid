import { FAQSection, ForBusinessesSection, HowItWorksSection } from "@/components/landing";
import { InvestorSection } from "@/components/landing/for-investor";
import HeroSection from "@/components/landing/hero-section";
import { ProvenanceSection } from "@/components/landing/provenanceSection";

export default function Page() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ForBusinessesSection />
      <InvestorSection />
      <ProvenanceSection />
      <FAQSection />
    </>
  );
}
