<<<<<<< HEAD
// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
export default function Page() {
  return null;
=======
"use client";

import { useState } from "react";

import { WhitelistStatusBadge } from "@/components/shared/domain/status-badges";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { INVESTOR_NOTIFICATION_PREFS, INVESTOR_PROFILE } from "@/components/investor";

import { NotificationToggle } from "@/components/shared/ui";

// Screen 25-invSettings. No backend exists yet — profile fields are
// real controlled inputs (ready for a future save action), and the
// screen shows no Save button, so none is invented here. Notification
// toggles are genuinely interactive but local-only (reset on reload).
// Whitelist state is hardcoded "whitelisted" — the export isolates the
// cleared state ("Whitelisted / Cleared to fund invoices"); wire the
// real WhitelistStatus once a session/profile fetch exists.
export default function Page() {
  const [fullName, setFullName] = useState(INVESTOR_PROFILE.fullName);
  const [email, setEmail] = useState(INVESTOR_PROFILE.email);
  const [countryOfResidence, setCountryOfResidence] = useState(INVESTOR_PROFILE.countryOfResidence);

  const [notificationState, setNotificationState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INVESTOR_NOTIFICATION_PREFS.map((pref) => [pref.key, pref.defaultOn])),
  );

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="countryOfResidence" className="text-muted-foreground text-sm">
            Country of residence
          </label>
          <Input
            id="countryOfResidence"
            className="mt-2"
            value={countryOfResidence}
            onChange={(event) => setCountryOfResidence(event.target.value)}
          />
        </div>
      </Card>

      <Card className="flex flex-row items-center justify-between gap-3 p-6">
        <div>
          <h2 className="text-foreground font-semibold">Whitelisting status</h2>
          <p className="text-muted-foreground mt-1 font-mono text-sm">Cleared to fund invoices</p>
        </div>
        <WhitelistStatusBadge className="w-fit" status="whitelisted" />
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
>>>>>>> 126c1250105090cfeb3f5a136297e976271e7075
}
