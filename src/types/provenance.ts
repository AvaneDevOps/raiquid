// Components used only within the provenance area — if a second area needs one of
// these, promote it to src/components/shared/ instead of duplicating it.

export interface ProvenanceItem {
  title: string;
  description: string;
  icon?: "check" | "trust";
  emoji?: string;
}

export const provenanceItems: ProvenanceItem[] = [
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
    emoji: "🕑",
  },
  {
    title: "Progressive trust",
    description:
      "Buyers move from Quarried to Carried to Anchored as they pay on time, unlocking higher limits and lower reserve requirements.",
    icon: "trust",
  },
];
