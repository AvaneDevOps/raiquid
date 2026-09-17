"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { ApiError, businessService } from "@/services";

import {
  BUSINESS_PROFILE,
  NOTIFICATION_PREFERENCES,
  PASSWORD_LAST_CHANGED_LABEL,
} from "./_components/fixtures";
import { NotificationToggle } from "./_components/notification-toggle";

interface SettingsResponse {
  legalName: string;
  contactEmail: string | null;
  contactPhone: string | null;
}

// Screen 12-bizSettings, wired to real GET/PATCH /business/settings
// (confirmed against raiquid-api's BusinessController/BusinessService and
// UpdateBusinessSettingsDto). The response/DTO also has
// registrationNumber, countryOfIncorporation and payoutWalletAddress —
// none of those have an input on this screen yet (only legalName/
// contactEmail/contactPhone did, mapped from the old
// name/contactEmail/phone fixture fields), so they're left out rather
// than invented here — see docs/RAIQUID_CONTEXT.md, "Open decisions".
// Notification toggles stay local-only — no notification-preferences
// endpoint exists anywhere on the backend.
export default function Page() {
  const { getToken } = useAuth();

  const [businessName, setBusinessName] = useState(BUSINESS_PROFILE.name);
  const [contactEmail, setContactEmail] = useState(BUSINESS_PROFILE.contactEmail);
  const [phone, setPhone] = useState(BUSINESS_PROFILE.phone ?? "");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const response = await businessService.get<SettingsResponse>("/business/settings", token);
        if (!active) return;
        setBusinessName(response.legalName);
        setContactEmail(response.contactEmail ?? "");
        setPhone(response.contactPhone ?? "");
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Couldn't load your business profile.",
          );
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
      await businessService.patch(
        "/business/settings",
        {
          legalName: businessName,
          contactEmail,
          contactPhone: phone,
        },
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
    Object.fromEntries(NOTIFICATION_PREFERENCES.map((pref) => [pref.key, pref.defaultOn])),
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <Card className="space-y-6 p-6">
        <h3 className="text-foreground font-semibold">Business profile</h3>

        <div>
          <label htmlFor="businessName" className="text-muted-foreground text-sm">
            Business name
          </label>
          <Input
            id="businessName"
            className="mt-2"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            disabled={saving}
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
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-muted-foreground text-sm">
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            className="mt-2"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
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
        <h3 className="text-foreground font-semibold">Notifications</h3>
        <div className="divide-border mt-4 divide-y">
          {NOTIFICATION_PREFERENCES.map((pref) => (
            <div
              key={pref.key}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-foreground">{pref.label}</span>
              <NotificationToggle
                isOn={notificationState[pref.key]}
                onToggle={() =>
                  setNotificationState((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))
                }
                label={pref.label}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-center justify-between gap-4 p-6">
        <div>
          <h3 className="text-foreground font-semibold">Security</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Password last changed {PASSWORD_LAST_CHANGED_LABEL}
          </p>
        </div>
        <Button variant="secondary" disabled title="Not available yet">
          Change password
        </Button>
      </Card>
    </div>
  );
}
