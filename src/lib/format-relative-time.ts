// Colocated with the notifications route — only this screen needs a
// genuinely relative ("Today", "Yesterday", "N days ago") label, unlike
// format.ts's other helpers which format an absolute point in time.
//
// This is computed against the real current time on purpose: "Today ·
// 09:14" is only meaningful relative to whenever the page is actually
// viewed, not to a timestamp fixed when this file was written.
export function formatRelativeTime(isoDateTime: string, now: Date = new Date()): string {
  const then = new Date(isoDateTime);
  if (Number.isNaN(then.getTime())) return isoDateTime;

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round(
    (startOfDay(now).getTime() - startOfDay(then).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff <= 0) {
    const time = then.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `Today · ${time}`;
  }
  if (dayDiff === 1) return "Yesterday";
  return `${dayDiff} days ago`;
}
