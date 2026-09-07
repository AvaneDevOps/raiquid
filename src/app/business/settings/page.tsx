"use client";

import { useState } from "react";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";

import {
  BUSINESS_PROFILE,
  NOTIFICATION_PREFERENCES,
  PASSWORD_LAST_CHANGED_LABEL,
} from "./_components/fixtures";
import { NotificationToggle } from "./_components/notification-toggle";

// Screen 12-bizSettings. No backend exists yet — profile fields are
// real controlled inputs (ready for a future save action), and the
// screen shows no Save button, so none is invented here. Notification
// toggles are genuinely interactive but local-only (reset on reload).
export default function Page() {
  const [businessName, setBusinessName] = useState(BUSINESS_PROFILE.name);
  const [contactEmail, setContactEmail] = useState(BUSINESS_PROFILE.contactEmail);
  const [phone, setPhone] = useState(BUSINESS_PROFILE.phone ?? "");

  const [notificationState, setNotificationState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_PREFERENCES.map((pref) => [pref.key, pref.defaultOn])),
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

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
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-foreground font-semibold">Notifications</h3>
        <div className="divide-border mt-4 divide-y">
          {NOTIFICATION_PREFERENCES.map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
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

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground font-semibold">Security</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Password last changed {PASSWORD_LAST_CHANGED_LABEL}
          </p>
        </div>
        {/* No password-change flow exists yet — disabled rather than a
            button that looks actionable but silently does nothing. */}
        <Button variant="secondary" disabled title="Not available yet">
          Change password
        </Button>
      </Card>
    </div>
  );
}
