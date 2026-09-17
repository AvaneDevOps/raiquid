"use client";

import { useState } from "react";

import { InlineNotice } from "@/components/shared/ui/notice";
import { Button } from "@/components/shared/ui/button";
import { ApiError, confirmService } from "@/services";

export function ReviewActions({
  invoiceId,
  supplierName,
}: {
  invoiceId: string;
  supplierName: string;
}) {
  const [confirmed, setConfirmed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<"accepted" | "disputed" | null>(null);

  async function respond(accept: boolean) {
    setSubmitting(true);
    setError(null);
    try {
      await confirmService.submitReview(invoiceId, { accept });
      setResult(accept ? "accepted" : "disputed");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong submitting your response. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <InlineNotice tone={result === "accepted" ? "success" : "info"}>
        {result === "accepted"
          ? "Confirmed — thanks. The invoice can now move forward."
          : `Marked as disputed — ${supplierName} has been notified.`}
      </InlineNotice>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="accent-accent-400 mt-1 size-4"
        />
        <span>
          I confirm {supplierName} delivered the goods described, and that the amount above is
          genuinely owed, payable on the date shown.
        </span>
      </label>

      {error ? <InlineNotice tone="danger">{error}</InlineNotice> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="danger" disabled={submitting} onClick={() => respond(false)}>
          {submitting ? "Sending…" : "Decline"}
        </Button>
        <Button disabled={submitting || !confirmed} onClick={() => respond(true)}>
          {submitting ? "Sending…" : "Confirm & accept"}
        </Button>
      </div>
    </div>
  );
}
