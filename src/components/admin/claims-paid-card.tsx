import { Card, CardTitle } from "@/components/shared/ui/card";

// Screen 27-adminReserve. Not the shared EmptyState component: EmptyState's
// title *is* its whole content (screen 31), but here the card already has
// its own CardTitle ("Claims paid from reserve") above a plain centered
// line — adding EmptyState's title on top would duplicate the heading.
// Only the zero-claims case is designed today; a real claims list/table
// is an open question for whenever claimsPaid > 0 happens in the sandbox.
export function ClaimsPaidCard({ claimsPaid }: { claimsPaid: number }) {
  return (
    <Card className="p-5">
      <CardTitle>Claims paid from reserve</CardTitle>

      {claimsPaid === 0 ? (
        <div className="flex min-h-36 items-center justify-center text-center">
          <p className="text-muted-foreground text-sm">
            No claims yet — zero defaults recorded in the sandbox.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground mt-4 text-sm">{claimsPaid} claim(s) paid.</p>
      )}
    </Card>
  );
}
