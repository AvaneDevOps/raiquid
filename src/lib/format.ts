/**
 * Formatting helpers (currency, date, percent, etc.) go here.
 * TODO: implement. See docs/RAIQUID_CONTEXT.md for the conventions
 * observed in the designs (e.g. Naira with no decimals, "30 Oct 2026"
 * date format).
 */
export function formatNaira(amount: number): string {
  return String(amount);
}

export function formatDate(isoDate: string): string {
  return isoDate;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return String(value);
}

export function formatNumber(value: number): string {
  return String(value);
}

export function truncateMiddle(value: string, head = 6, tail = 4): string {
  return value;
}

export function daysUntil(isoDate: string, from: Date = new Date()): number {
  return 0;
}
