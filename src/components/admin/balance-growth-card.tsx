import type { ReserveBalancePoint } from "@/components/admin/fixtures";
import { Card, CardTitle } from "@/components/shared/ui/card";
import { formatMonthShort } from "@/lib/format";
import { cn } from "@/lib/utils";

// Screen 27-adminReserve. No divider under the title here (unlike
// "Recent on-chain activity" on the overview) — CardTitle is used directly,
// not wrapped in CardHeader, so no border-b is drawn.
//
// The "Apr — Aug 2026" range caption is derived from the first/last points
// in `data`, not passed in separately — the chart data is the single
// source of truth for what range it covers.
export function BalanceGrowthCard({ data }: { data: ReserveBalancePoint[] }) {
  const max = Math.max(...data.map((point) => point.value));
  const first = data[0];
  const last = data[data.length - 1];
  const rangeLabel = first
    ? `${formatMonthShort(first.date)} — ${formatMonthShort(last.date)} ${new Date(last.date).getFullYear()}`
    : null;

  return (
    <Card className="p-5">
      <CardTitle>Balance growth</CardTitle>

      <div className="mt-10 flex h-40 items-end gap-3">
        {data.map((point) => (
          <div
            key={point.date}
            className={cn(
              "flex-1 rounded-md",
              point.highlighted
                ? "from-accent-400 to-accent-600 bg-linear-to-b"
                : "bg-surface-raised",
            )}
            style={{ height: `${Math.max((point.value / max) * 100, 8)}%` }}
          />
        ))}
      </div>

      {rangeLabel ? (
        <p className="text-muted-foreground mt-3 font-mono text-xs">{rangeLabel}</p>
      ) : null}
    </Card>
  );
}
