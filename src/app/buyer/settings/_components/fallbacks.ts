export interface BuyerAuthorizedContact {
  name: string;
  role: string;
  permission: string;
  tone: "green" | "neutral";
}

export interface BuyerNotificationPreference {
  key: string;
  label: string;
  defaultOn: boolean;
}

export const BUYER_SETTINGS_FALLBACKS: {
  authorizedContacts: BuyerAuthorizedContact[];
  notificationPreferences: BuyerNotificationPreference[];
} = {
  authorizedContacts: [
    {
      name: "Tunde Bakare",
      role: "Finance Lead",
      permission: "Can accept invoices",
      tone: "green",
    },
    {
      name: "Chioma Eze",
      role: "Operations",
      permission: "View only",
      tone: "neutral",
    },
  ],
  notificationPreferences: [
    {
      key: "invoice_confirmation",
      label: "New invoice awaiting confirmation",
      defaultOn: true,
    },
    {
      key: "payment_due",
      label: "Payment due reminders",
      defaultOn: true,
    },
  ],
} as const;

export type BuyerSettingsDataSource = "api" | "fallback";
