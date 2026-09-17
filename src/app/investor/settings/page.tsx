"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import { WhitelistStatusBadge } from "@/components/shared/domain/status-badges";
import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { INVESTOR_NOTIFICATION_PREFS } from "@/components/investor";
import { NotificationToggle } from "@/components/shared/ui";
import { ApiError, investorService } from "@/services";
import type { WhitelistStatus } from "@/types";

interface SettingsResponse {
  displayName: string | null;
  countryOfResidence: string | null;
}

interface WhitelistingResponse {
  whitelistStatus: WhitelistStatus;
}

// Screen 25-invSettings, wired to real GET/PATCH /investor/settings
// (confirmed against raiquid-api's InvestorController/InvestorService and
// UpdateInvestorSettingsDto: displayName, countryOfResidence,
// investingWalletAddress — the last has no input on this screen yet).
// Email has no field on Investor at all (it lives on the linked Clerk
// user, not this model) — sourced from the real signed-in Clerk user via
// useUser() instead of the INVESTOR_PROFILE fixture; not editable here,
// same as it wasn't before. Whitelist status is now the real
// GET /investor/whitelisting value instead of a hardcoded "whitelisted".
// Notification toggles stay local-only — no notification-preferences
// endpoint exists. See docs/RAIQUID_CONTEXT.md, "Open decisions".
export default function Page() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [fullName, setFullName] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = await getToken();
        const [settings, whitelisting] = await Promise.all([
          investorService.get<SettingsResponse>("/investor/settings", token),
          investorService.get<WhitelistingResponse>("/investor/whitelisting", token),
        ]);
        if (!active) return;
        setFullName(settings.displayName ?? "");
        setCountryOfResidence(settings.countryOfResidence ?? "");
        setWhitelistStatus(whitelisting.whitelistStatus);
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Couldn't load your settings.");
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
      await investorService.patch(
        "/investor/settings",
        { displayName: fullName, countryOfResidence },
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
    Object.fromEntries(INVESTOR_NOTIFICATION_PREFS.map((pref) => [pref.key, pref.defaultOn])),
  );

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      <Card className="space-y-6 p-6">
        <h2 className="text-foreground font-semibold">Profile</h2>

        <div>
          <label htmlFor="fullName" className="text-muted-foreground text-sm">
            Full name
          </label>
          <Input
            id="fullName"
            className="mt-2"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-muted-foreground text-sm">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            className="mt-2"
            value={user?.primaryEmailAddress?.emailAddress ?? ""}
            disabled
          />
        </div>

        <div>
          <label htmlFor="countryOfResidence" className="text-muted-foreground text-sm">
            Country of residence (2-letter ISO code, e.g. NG)
          </label>
          <Input
            id="countryOfResidence"
            className="mt-2 uppercase"
            maxLength={2}
            value={countryOfResidence}
            onChange={(event) => setCountryOfResidence(event.target.value.toUpperCase())}
            disabled={saving}
          />
        </div>

        {saveError ? <InlineNotice tone="danger">{saveError}</InlineNotice> : null}
        {saved ? <InlineNotice tone="success">Saved.</InlineNotice> : null}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </Card>

      <Card className="flex flex-row items-center justify-between gap-3 p-6">
        <div>
          <h2 className="text-foreground font-semibold">Whitelisting status</h2>
        </div>
        {whitelistStatus ? (
          <WhitelistStatusBadge className="w-fit" status={whitelistStatus} />
        ) : null}
      </Card>

      <Card className="p-6">
        <h2 className="text-foreground font-semibold">Notifications</h2>
        <div className="divide-border mt-4 divide-y">
          {INVESTOR_NOTIFICATION_PREFS.map((pref) => (
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
    </div>
  );
}
