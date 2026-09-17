import { auth } from "@clerk/nextjs/server";

import { Stepper } from "@/components/shared/domain/stepper";
import { InlineNotice } from "@/components/shared/ui/notice";
import { WHITELIST_STEPS } from "@/lib/domain-display";
import { investorService } from "@/services";
import type { WhitelistStatus } from "@/types";

import { WhitelistingForm } from "./_components/whitelisting-form";

interface WhitelistingResponse {
  whitelistStatus: WhitelistStatus;
  countryOfResidence: string | null;
  displayName: string | null;
}

// WHITELIST_STEPS order matches the real WhitelistStatus enum order exactly
// (raiquid-api's prisma/schema.prisma): identity_submitted (not yet
// submitted — the default/initial state, despite the name), in_review,
// whitelisted.
const STEP_INDEX: Record<WhitelistStatus, number> = {
  identity_submitted: 0,
  in_review: 1,
  whitelisted: 2,
};

// Screen 18-invWhitelist, wired to GET /investor/whitelisting — confirmed
// against the backend source (raiquid-api's
// InvestorController.getWhitelisting / InvestorService.getWhitelisting):
// { whitelistStatus, countryOfResidence, displayName }. The old
// "Documents submitted" card was fixture data with no backing endpoint at
// all (no per-document status exists anywhere) — dropped rather than kept
// next to real data.
export default async function WhitelistPage() {
  const { getToken } = await auth();
  const token = await getToken();

  let status: WhitelistStatus;
  try {
    const response = await investorService.get<WhitelistingResponse>(
      "/investor/whitelisting",
      token,
    );
    status = response.whitelistStatus;
  } catch (error) {
    return (
      <div className="w-full max-w-xl space-y-8">
        <div>
          <h1 className="font-display text-foreground text-3xl font-semibold">
            Getting you whitelisted
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Required before you can fund any invoice.
          </p>
        </div>
        <InlineNotice tone="danger">
          {error instanceof Error ? error.message : "Couldn't load whitelisting status."}
        </InlineNotice>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-foreground text-3xl font-semibold">
          Getting you whitelisted
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Required before you can fund any invoice.
        </p>
      </div>

      <Stepper steps={WHITELIST_STEPS} currentIndex={STEP_INDEX[status]} />

      {status === "identity_submitted" ? (
        <>
          <WhitelistingForm />
          <InlineNotice tone="info">
            You can browse the marketplace now — funding unlocks the moment whitelisting completes.
          </InlineNotice>
        </>
      ) : status === "whitelisted" ? (
        <InlineNotice tone="success">
          You&apos;re whitelisted — you can fund any invoice on the marketplace.
        </InlineNotice>
      ) : (
        <InlineNotice tone="info">
          Your details are in review — this usually takes one business day. You can browse the
          marketplace now; funding unlocks the moment whitelisting completes.
        </InlineNotice>
      )}
    </div>
  );
}
