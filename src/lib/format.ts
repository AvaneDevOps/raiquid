const NAIRA = "₦";

export function formatNaira(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  const grouped = rounded.toLocaleString("en-NG");
  // screens 01/09/20 show deductions as "−₦60,000", not "(₦60,000)"
  return amount < 0 ? `−${NAIRA}${grouped}` : `${NAIRA}${grouped}`;
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  // "02 Aug 2026" — day is zero-padded (screen 10)
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-NG");
}

export function truncateMiddle(value: string, head = 6, tail = 4): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function daysUntil(isoDate: string, from: Date = new Date()): number {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((end - start) / msPerDay);
}
