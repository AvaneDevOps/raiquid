// Colocated with the ledger route, not src/lib/format.ts — "27 Aug ·
// 14:02" (date + 24-hour time, no year) is only needed on this screen.
// UTC keeps it stable regardless of the viewer's local timezone (these
// are sandbox-recorded event times).
export function formatTimestamp(isoDateTime: string): string {
  const d = new Date(isoDateTime);
  if (Number.isNaN(d.getTime())) return isoDateTime;
  const datePart = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
  const timePart = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `${datePart} · ${timePart}`;
}
