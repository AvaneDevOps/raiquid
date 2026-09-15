"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { BUYER_SETTINGS } from "@/components/buyer/fixtures";
import { buyerService } from "@/services/buyer";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { Button } from "@/components/shared/ui/button";

import { NotificationToggle } from "./notification-toggle";
import type { BuyerSettingsData } from "@/services/buyer";

interface BuyerSettingsFormProps {
  initialSettings: BuyerSettingsData;
}

export function BuyerSettingsForm({ initialSettings }: BuyerSettingsFormProps) {
  const { getToken } = useAuth();

  const [companyName, setCompanyName] = useState(initialSettings.legalName);
  const [billingEmail, setBillingEmail] = useState(initialSettings.contactEmail);
  const [phone, setPhone] = useState(initialSettings.contactPhone);
  const [saving, setSaving] = useState(false);

  const [notificationState, setNotificationState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BUYER_SETTINGS.notifications.map((item) => [item.key, item.defaultOn])),
  );

  async function handleSave() {
    setSaving(true);

    try {
      const token = await getToken();

      const updated = await buyerService.updateSettings(
        {
          legalName: companyName,
          contactEmail: billingEmail,
          contactPhone: phone,
        },
        token,
      );

      setCompanyName(updated.legalName);
      setBillingEmail(updated.contactEmail);
      setPhone(updated.contactPhone);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

      <Card className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-foreground font-semibold">Company profile</h2>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div>
          <label htmlFor="companyName" className="text-muted-foreground text-sm">
            Company name
          </label>
          <Input
            id="companyName"
            className="mt-2"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="billingEmail" className="text-muted-foreground text-sm">
            Billing contact email
          </label>
          <Input
            id="billingEmail"
            type="email"
            className="mt-2"
            value={billingEmail}
            onChange={(event) => setBillingEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-muted-foreground text-sm">
            Contact phone
          </label>
          <Input
            id="phone"
            type="tel"
            className="mt-2"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-foreground font-semibold">Authorized contacts</h2>

        <div className="divide-border mt-5 divide-y">
          {BUYER_SETTINGS.authorizedContacts.map((contact) => (
            <div
              key={contact.name}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-foreground">
                {contact.name} · {contact.role}
              </span>

              <span
                className={
                  contact.tone === "green"
                    ? "seal-chip text-success font-mono text-xs"
                    : "seal-chip text-muted-foreground font-mono text-xs"
                }
              >
                {contact.permission}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-foreground font-semibold">Notifications</h2>

        <div className="divide-border mt-4 divide-y">
          {BUYER_SETTINGS.notifications.map((item) => (
            <div
              key={item.key}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-foreground">{item.label}</span>

              <NotificationToggle
                isOn={notificationState[item.key]}
                onToggle={() =>
                  setNotificationState((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key],
                  }))
                }
                label={item.label}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
