import type { Business } from "@/types";

/**
 * Route-local — nothing else needs this shape yet. Dummy data until a
 * real API exists (see docs/RAIQUID_CONTEXT.md, "Open decisions").
 */
export const BUSINESS_PROFILE: Pick<Business, "name" | "contactEmail" | "phone"> = {
  name: "Okonkwo Textiles & Supplies",
  contactEmail: "adaeze@okonkwotextiles.com",
  phone: "+234 803 555 0142",
};

export const NOTIFICATION_PREFERENCES = [
  { key: "invoiceAccepted", label: "Invoice accepted by a buyer", defaultOn: true },
  { key: "fundingProgress", label: "Funding progress updates", defaultOn: true },
  { key: "paymentDue", label: "Payment due reminders", defaultOn: true },
] as const;

export const PASSWORD_LAST_CHANGED_LABEL = "3 months ago";
