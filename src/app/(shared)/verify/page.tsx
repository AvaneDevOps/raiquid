// TODO: implement. See docs/ROUTE_MAP.md for the source screen reference
// and docs/RAIQUID_CONTEXT.md for domain/business context.
import { Stepper } from "@/components/shared/domain/stepper";
import { InlineNotice } from "@/components/shared/ui/notice";
import { LandingHeader } from "@/components/shared/layout/landing-header";

import { VerificationChecklistCard } from "@/components/shared/verify/verification-checklist";
import {
  VERIFICATION_FIXTURE,
  VERIFICATION_STATUS_STEP_INDEX,
  VERIFICATION_STEPS,
} from "@/components/shared/verify/fixtures";

// Screen 03-verify. LandingHeader, no footer, wide left-aligned column, no
// card around the page content itself — see docs/DESIGN_SYSTEM.md, "Layout
// shells". Reachable without an auth check per docs/ROUTE_MAP.md.
export default function Page() {
  const currentIndex = VERIFICATION_STATUS_STEP_INDEX[VERIFICATION_FIXTURE.status];

  return (
    <>
      <LandingHeader />

      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="max-w-xl">
          <h1 className="font-display text-foreground text-3xl font-semibold">
            Verifying your business
          </h1>
          <p className="text-muted-foreground mt-1">{VERIFICATION_FIXTURE.businessName}</p>

          <Stepper steps={VERIFICATION_STEPS} currentIndex={currentIndex} className="mt-8" />

          <div className="mt-8">
            <VerificationChecklistCard checks={VERIFICATION_FIXTURE.documentChecks} />
          </div>

          <InlineNotice tone="info" className="mt-6">
            This usually takes less than one business day in the sandbox. We&apos;ll email you the
            moment it&apos;s done — you don&apos;t need to wait here.
          </InlineNotice>
        </div>
      </main>
    </>
  );
}
