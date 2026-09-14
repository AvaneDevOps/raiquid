"use client";

import { useState } from "react";

import { BUYER_PROFILE, BUYER_SETTINGS } from "@/components/buyer/fixtures";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";

import { NotificationToggle } from "./_components/notification-toggle";

export default function Page() {
  const [companyName, setCompanyName] = useState(BUYER_PROFILE.companyName);
  const [billingEmail, setBillingEmail] = useState(BUYER_PROFILE.billingEmail);
  const [notificationState, setNotificationState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(BUYER_SETTINGS.notifications.map((item) => [item.key, item.defaultOn])),
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-foreground text-3xl font-semibold">Settings</h1>

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
