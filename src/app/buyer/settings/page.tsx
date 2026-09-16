"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { BUYER_SETTINGS } from "@/components/buyer/fixtures";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ApiError, buyerService } from "@/services";

import { NotificationToggle } from "./_components/notification-toggle";

interface SettingsResponse {
  legalName?: string;
  contactEmail?: string;
}

// Screen 17-buySettings (company profile card), wired to real
// GET/PATCH /buyer/settings (confirmed against raiquid-api's
// BuyerController/BuyerService and UpdateBuyerSettingsDto: legalName,
// contactEmail, contactPhone — contactPhone has no input on this screen,
// same as business settings). Authorized contacts have no real backing
// (no such concept on the Buyer model) — left on the BUYER_SETTINGS
// fixture. Notifications stay local-only — no notification-preferences
// endpoint exists. See docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  const { getToken } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const response = await buyerService.get<SettingsResponse>("/buyer/settings", token);
        if (!active) return;
        if (response.legalName !== undefined) setCompanyName(response.legalName);
        if (response.contactEmail !== undefined) setBillingEmail(response.contactEmail);
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Couldn't load your profile.");
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once on mount
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const token = await getToken();
      await buyerService.patch(
        "/buyer/settings",
        { legalName: companyName, contactEmail: billingEmail },
        token,
      );
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.message : "Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const [notificationState, setNotificationState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BUYER_SETTINGS.notifications.map((item) => [item.key, item.defaultOn])),
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <Card className="space-y-6 p-6">
        <h2 className="text-foreground font-semibold">Company profile</h2>
        <div>
          <label htmlFor="companyName" className="text-muted-foreground text-sm">
            Company name
          </label>
          <Input
            id="companyName"
            className="mt-2"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            disabled={saving}
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
            disabled={saving}
          />
        </div>

        {saveError ? <InlineNotice tone="danger">{saveError}</InlineNotice> : null}
        {saved ? <InlineNotice tone="success">Saved.</InlineNotice> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
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
