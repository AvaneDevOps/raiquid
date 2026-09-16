"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { Input } from "@/components/shared/ui/input";
import { InlineNotice } from "@/components/shared/ui/notice";
import { truncateMiddle } from "@/lib/format";
import { ApiError, businessService } from "@/services";

// payoutWalletAddress is a real column on Business, exposed by
// GET /business/settings (no `select` restriction there) and accepted by
// PATCH /business/settings's UpdateBusinessSettingsDto — confirmed
// directly, not guessed. Same edit pattern as the rest of this settings
// form, and the same truncated-address display used in the admin ledger.
export function PayoutAccountCard({ initialAddress }: { initialAddress: string | null }) {
  const { getToken } = useAuth();
  const [address, setAddress] = useState(initialAddress ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(address);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await businessService.patch("/business/settings", { payoutWalletAddress: draft }, token);
      setAddress(draft);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <Card className="p-5 sm:p-7">
        <div className="space-y-4">
          <div>
            <label htmlFor="payoutWalletAddress" className="text-muted-foreground text-sm">
              Payout wallet address
            </label>
            <Input
              id="payoutWalletAddress"
              className="mt-2 font-mono"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={saving}
            />
          </div>
          {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={saving}
              onClick={() => {
                setDraft(address);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" disabled={saving} onClick={handleSave}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex items-center justify-between gap-4 p-5 sm:p-7">
      <div className="min-w-0 flex-1">
        <h2 className="text-foreground text-lg font-semibold">Payout account</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm">
          {address ? truncateMiddle(address) : "Payout wallet not yet connected."}
        </p>
      </div>
      <Button
        variant="secondary"
        className="shrink-0"
        onClick={() => {
          setDraft(address);
          setEditing(true);
        }}
      >
        {address ? "Change account" : "Connect wallet"}
      </Button>
    </Card>
  );
}
