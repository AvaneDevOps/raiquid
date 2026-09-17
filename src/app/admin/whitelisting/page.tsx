import { auth } from "@clerk/nextjs/server";

import { InlineNotice } from "@/components/shared/ui/notice";
import { adminService } from "@/services";

import { WhitelistingQueue, type QueueRow } from "./_components/whitelisting-queue";

// Screen not built yet — new admin route, wired to GET /admin/whitelisting
// / POST /admin/whitelisting/{investorId}/decision, confirmed against the
// backend source (raiquid-api's AdminController/AdminService
// .listWhitelistingQueue/.decideWhitelisting), not guessed.
//
// The queue endpoint's own where-clause is
// `whitelistStatus: { not: whitelisted }` — it returns every investor who
// isn't whitelisted yet, which includes "identity_submitted" (hasn't even
// filled the form), not just "in_review". decideWhitelisting throws a 409
// for anything that isn't "in_review", so this filters to in_review
// client-side before rendering — showing Approve/Reject on an
// identity_submitted row would just fail every time.
//
// "Legal name" here is Investor.displayName — the submit form's DTO field
// is called legalName, but the stored/returned field is displayName
// (confirmed both ways in the backend source). "Submitted date" has no
// dedicated field on Investor — updatedAt is the closest real proxy, since
// it's set exactly when the investor submits or a decision changes their
// status.
function isInReview(raw: Record<string, unknown>): boolean {
  return raw.whitelistStatus === "in_review";
}

function toQueueRow(raw: Record<string, unknown>): QueueRow {
  return {
    id: String(raw.id ?? ""),
    legalName: String(raw.displayName ?? "—"),
    countryOfResidence: String(raw.countryOfResidence ?? "—"),
    submittedAt: String(raw.updatedAt ?? ""),
  };
}

export default async function Page() {
  const { getToken } = await auth();
  const token = await getToken();

  let rows: QueueRow[] = [];
  let loadError: string | null = null;
  try {
    const response = await adminService.get<{ data: Record<string, unknown>[] }>(
      "/admin/whitelisting",
      token,
    );
    rows = response.data.filter(isInReview).map(toQueueRow);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Couldn't load the whitelisting queue.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">Whitelisting review</h1>
        <p className="text-muted-foreground mt-1">Investors awaiting a whitelisting decision.</p>
      </div>

      {loadError ? (
        <InlineNotice tone="danger">{loadError}</InlineNotice>
      ) : (
        <WhitelistingQueue initialRows={rows} />
      )}
    </div>
  );
}
