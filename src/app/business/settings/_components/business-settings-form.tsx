"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { businessService, type BusinessSettings } from "@/services/business";

export function BusinessSettingsForm({ initialSettings }: { initialSettings: BusinessSettings }) {
  const { getToken } = useAuth();

  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof BusinessSettings, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const token = await getToken();

      const updated = await businessService.updateSettings(
        {
          legalName: form.legalName,
          registrationNumber: form.registrationNumber,
          countryOfIncorporation: form.countryOfIncorporation,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          payoutWalletAddress: form.payoutWalletAddress,
        },
        token,
      );

      setForm(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage the business details used for invoices and payouts.
        </p>
      </div>

      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
      {saved ? <InlineNotice tone="success">Settings saved successfully.</InlineNotice> : null}

      <Card className="space-y-6 p-6">
        <h2 className="text-foreground font-semibold">Business profile</h2>

        <div>
          <label htmlFor="businessName" className="text-muted-foreground text-sm">
            Business name
          </label>
          <Input
            id="businessName"
            className="mt-2"
            value={form.legalName}
            onChange={(event) => updateField("legalName", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="registrationNumber" className="text-muted-foreground text-sm">
            Registration number
          </label>
          <Input
            id="registrationNumber"
            className="mt-2"
            value={form.registrationNumber}
            onChange={(event) => updateField("registrationNumber", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="countryOfIncorporation" className="text-muted-foreground text-sm">
            Country of incorporation
          </label>
          <Input
            id="countryOfIncorporation"
            className="mt-2"
            value={form.countryOfIncorporation}
            onChange={(event) => updateField("countryOfIncorporation", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="text-muted-foreground text-sm">
            Contact email
          </label>
          <Input
            id="contactEmail"
            type="email"
            className="mt-2"
            value={form.contactEmail}
            onChange={(event) => updateField("contactEmail", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="text-muted-foreground text-sm">
            Phone number
          </label>
          <Input
            id="contactPhone"
            type="tel"
            className="mt-2"
            value={form.contactPhone}
            onChange={(event) => updateField("contactPhone", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="payoutWalletAddress" className="text-muted-foreground text-sm">
            Payout wallet address
          </label>
          <Input
            id="payoutWalletAddress"
            className="mt-2"
            value={form.payoutWalletAddress}
            onChange={(event) => updateField("payoutWalletAddress", event.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-foreground font-semibold">Notifications</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Notification preferences are currently managed locally because the backend does not expose
          notification settings.
        </p>
      </Card>

      <Card className="flex items-center justify-between gap-4 p-6">
        <div>
          <h2 className="text-foreground font-semibold">Security</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Password management is not exposed by the current Raiquid API.
          </p>
        </div>

        <Button variant="secondary" disabled title="Not available yet">
          Change password
        </Button>
      </Card>
    </div>
  );
}
