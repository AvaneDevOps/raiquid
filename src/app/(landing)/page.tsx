// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference

import InvestorSection from "@/components/buyer/investor/investorSection";
import ProvenanceSection from "@/components/buyer/provenance/provenanceSection";

// and docs/RAIQUID_CONTEXT.md for domain/business context.

export default function Page() {
  return (
    <div>
      <InvestorSection />
      <ProvenanceSection />
    </div>
  );
}
