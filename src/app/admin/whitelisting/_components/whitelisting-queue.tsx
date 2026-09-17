"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/shared/ui/button";
import { Card } from "@/components/shared/ui/card";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import { formatDate } from "@/lib/format";
import { ApiError, adminService } from "@/services";

export interface QueueRow {
  id: string;
  legalName: string;
  countryOfResidence: string;
  submittedAt: string;
}

// POST /admin/whitelisting/{investorId}/decision (WhitelistDecisionDto —
// confirmed against raiquid-api's whitelist-decision.dto.ts): { approve }.
// On success the row is removed locally rather than refetching the whole
// queue — decideWhitelisting already changed the row's status server-side,
// so it wouldn't show up in a refetch either way.
export function WhitelistingQueue({ initialRows }: { initialRows: QueueRow[] }) {
  const { getToken } = useAuth();
  const [rows, setRows] = useState(initialRows);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function decide(investorId: string, approve: boolean) {
    setPendingId(investorId);
    setRowErrors((prev) => ({ ...prev, [investorId]: "" }));
    try {
      const token = await getToken();
      await adminService.post(`/admin/whitelisting/${investorId}/decision`, { approve }, token);
      setRows((prev) => prev.filter((row) => row.id !== investorId));
      setConfirmation(approve ? "Investor whitelisted." : "Investor sent back to resubmit.");
    } catch (error) {
      setRowErrors((prev) => ({
        ...prev,
        [investorId]:
          error instanceof ApiError ? error.message : "Something went wrong. Try again.",
      }));
    } finally {
      setPendingId(null);
    }
  }

  if (rows.length === 0) {
    return confirmation ? (
      <InlineNotice tone="success">{confirmation}</InlineNotice>
    ) : (
      <EmptyState
        title="Nothing awaiting review"
        description="Investors show up here once they submit their whitelisting details."
      />
    );
  }

  return (
    <div className="space-y-4">
      {confirmation ? <InlineNotice tone="success">{confirmation}</InlineNotice> : null}
      <Card>
        <div className="divide-border divide-y">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="text-foreground text-sm font-medium">{row.legalName}</p>
                <p className="text-muted-foreground text-sm">
                  {row.countryOfResidence} · submitted {formatDate(row.submittedAt)}
                </p>
                {rowErrors[row.id] ? (
                  <p className="text-danger mt-1 text-sm">{rowErrors[row.id]}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={pendingId === row.id}
                  onClick={() => decide(row.id, false)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  disabled={pendingId === row.id}
                  onClick={() => decide(row.id, true)}
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
