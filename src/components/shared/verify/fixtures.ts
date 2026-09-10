import type { StepperStep } from "@/components/shared/domain/stepper";
import type { BusinessVerification } from "@/types";

// Screen 03-verify. Colocated here, not domain-display.ts — this stepper
// and its fixture are only used on this one route, unlike
// INVOICE_LIFECYCLE_STEPS/WHITELIST_STEPS, which back multiple screens.
export const VERIFICATION_STEPS: StepperStep[] = [
  { key: "documents_submitted", label: "Documents submitted" },
  { key: "under_review", label: "Under review" },
  { key: "verified", label: "Verified" },
];

export const VERIFICATION_STATUS_STEP_INDEX: Record<BusinessVerification["status"], number> = {
  documents_submitted: 0,
  under_review: 1,
  verified: 2,
};

export const VERIFICATION_FIXTURE: BusinessVerification = {
  businessName: "Okonkwo Textiles & Supplies",
  status: "under_review",
  documentChecks: [
    { label: "Business registration document", status: "received" },
    { label: "Director's means of identification", status: "received" },
    { label: "Proof of business address", status: "in_review" },
  ],
};
