// Dev-only component gallery — delete or gate behind NODE_ENV before shipping.

import type { ReactNode } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Card, CardHeader, CardTitle, StatCard } from "@/components/shared/ui/card";
import { ProgressBar } from "@/components/shared/ui/progress-bar";
import { EmptyState, InlineNotice } from "@/components/shared/ui/notice";
import {
  InvoiceStatusBadge,
  ProvenanceTierBadge,
  WhitelistStatusBadge,
  OnChainStatusBadge,
  InvoiceRef,
} from "@/components/shared/domain/status-badges";
import { Stepper } from "@/components/shared/domain/stepper";
import { Sidebar } from "@/components/shared/layout/sidebar";
import { BottomTabBar } from "@/components/shared/layout/bottom-tab-bar";
import { RoleShell } from "@/components/shared/layout/role-shell";
import { AdminShell } from "@/components/shared/layout/admin-shell";
import { UserSummary } from "@/components/shared/layout/user-summary";
import { LandingHeader } from "@/components/shared/layout/landing-header";
import { LandingFooter } from "@/components/shared/layout/landing-footer";
import { StandaloneShell } from "@/components/shared/layout/standalone-shell";
import type { SessionUser } from "@/components/shared/layout/session-user";
import {
  INVOICE_LIFECYCLE_STEPS,
  WHITELIST_STEPS,
  INVOICE_STATUS_META,
  PROVENANCE_TIER_META,
  WHITELIST_STATUS_META,
  ONCHAIN_STATUS_META,
} from "@/lib/domain-display";
import type { InvoiceStatus, ProvenanceTier, WhitelistStatus, OnChainStatus } from "@/types";

export const metadata: Metadata = { title: "Component gallery (dev)" };

// Local-only preview fixture. getSessionUser() still throws "Not
// implemented" (auth isn't wired) — this stand-in exists ONLY for this
// gallery and is intentionally not exported or shared.
const PREVIEW_USER: SessionUser = {
  name: "Ada Okonkwo",
  subtitle: "Okonkwo Textiles Ltd",
  role: "business",
  initials: "AO",
};

const BUTTON_VARIANTS = ["primary", "secondary", "ghost", "danger"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;
const BADGE_TONES = ["amber", "green", "red", "neutral"] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-foreground text-xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

export default function ComponentGalleryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <header className="space-y-2">
        <h1 className="font-display text-foreground text-3xl font-semibold">
          Shared component gallery
        </h1>
        <p className="text-muted-foreground text-sm">
          Every shared primitive and every variant. Dev only — not linked from anywhere.
        </p>
      </header>

      <Section title="Button — variant × size">
        <div className="space-y-3">
          {BUTTON_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              {BUTTON_SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {variant} / {size}
                </Button>
              ))}
              <Button variant={variant} disabled>
                disabled
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/dev/components">asChild → Link</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Badge — tones (seal-chip shape: cut top-left + bottom-right)">
        <div className="flex flex-wrap gap-3">
          {BADGE_TONES.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Domain status badges">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {(Object.keys(INVOICE_STATUS_META) as InvoiceStatus[]).map((s) => (
              <InvoiceStatusBadge key={s} status={s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(PROVENANCE_TIER_META) as ProvenanceTier[]).map((t) => (
              <ProvenanceTierBadge key={t} tier={t} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(WHITELIST_STATUS_META) as WhitelistStatus[]).map((s) => (
              <WhitelistStatusBadge key={s} status={s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(ONCHAIN_STATUS_META) as OnChainStatus[]).map((s) => (
              <OnChainStatusBadge key={s} status={s} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <InvoiceRef id="RQ-INV-4471" />
            <InvoiceRef id="RQ-INV-4471-T1" />
          </div>
        </div>
      </Section>

      <Section title="Card / StatCard">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice RQ-INV-4471</CardTitle>
              <p className="text-muted-foreground text-sm">Okonkwo Textiles → Jumia</p>
            </CardHeader>
            <div className="text-muted-foreground p-5 text-sm">Card body content sits here.</div>
          </Card>
          <div className="grid gap-4">
            <StatCard label="Active invoices" value="3" />
            <StatCard
              label="You receive early"
              value="₦4,182,500"
              caption="After 3% fee + 1% reserve"
              emphasize
            />
          </div>
        </div>
      </Section>

      <Section title="ProgressBar">
        <div className="max-w-md space-y-4">
          <ProgressBar percent={12} />
          <ProgressBar percent={64} />
          <ProgressBar percent={100} />
        </div>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon={<Inbox />}
          title="No invoices yet"
          description="Upload an invoice a buyer owes you and we'll get it in front of investors."
          action={<Button size="sm">Upload invoice</Button>}
        />
      </Section>

      <Section title="InlineNotice — 3 tones">
        <div className="space-y-3">
          <InlineNotice tone="info">
            Simulated environment — this runs on the Base Sepolia sandbox and no real funds move.
          </InlineNotice>
          <InlineNotice tone="success">Buyer confirmed this invoice. Tokenizing now.</InlineNotice>
          <InlineNotice tone="danger">
            This on-chain transfer is taking longer than usual to confirm.
          </InlineNotice>
        </div>
      </Section>

      <Section title="Stepper">
        <div className="space-y-8">
          <Stepper steps={INVOICE_LIFECYCLE_STEPS} currentIndex={2} />
          <Stepper steps={WHITELIST_STEPS} currentIndex={1} />
        </div>
      </Section>

      <Section title="UserSummary">
        <div className="border-border bg-surface max-w-xs rounded-xl border p-4">
          <UserSummary user={PREVIEW_USER} />
        </div>
      </Section>

      <Section title="Sidebar (desktop nav — hidden below md)">
        <div className="border-border h-112 overflow-hidden rounded-xl border">
          <div className="flex h-full">
            <Sidebar role="business" user={PREVIEW_USER} />
            <div className="text-muted-foreground flex-1 p-6 text-sm">Role-shell content area.</div>
          </div>
        </div>
      </Section>

      <Section title="RoleShell (composes Sidebar + BottomTabBar + mobile header)">
        <div className="border-border h-112 overflow-y-auto rounded-xl border">
          <RoleShell role="investor" user={{ ...PREVIEW_USER, role: "investor" }}>
            <p className="text-muted-foreground text-sm">
              Page content renders here. Sidebar at md+, bottom tabs below.
            </p>
          </RoleShell>
        </div>
      </Section>

      <Section title="AdminShell (top tabs — identical at every breakpoint)">
        <div className="border-border overflow-hidden rounded-xl border">
          <AdminShell>
            <p className="text-muted-foreground text-sm">Admin content area.</p>
          </AdminShell>
        </div>
      </Section>

      <Section title="StandaloneShell (auth / verify / confirm)">
        <div className="border-border overflow-hidden rounded-xl border">
          <StandaloneShell>
            <h3 className="font-display text-foreground text-lg font-medium">Sign in to Raiquid</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Centered-card shell with no navigation.
            </p>
          </StandaloneShell>
        </div>
      </Section>

      <Section title="LandingHeader / LandingFooter">
        <div className="border-border overflow-hidden rounded-xl border">
          <LandingHeader />
          <div className="text-muted-foreground p-8 text-sm">Landing page body.</div>
          <LandingFooter />
        </div>
      </Section>

      <Section title="BottomTabBar (mobile nav — fixed to viewport bottom, hidden at md+)">
        <p className="text-muted-foreground text-sm">
          Rendered below; narrow the viewport under 768px to see it.
        </p>
        <BottomTabBar role="business" />
        <div className="h-16" />
      </Section>
    </div>
  );
}
