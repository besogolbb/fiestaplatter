import { siteConfig } from "@/config/site";

/** The kitchen's timezone — lead-time rules are judged in Manila, not the server's or browser's zone. */
export const BUSINESS_TIMEZONE = "Asia/Manila";

/** YYYY-MM-DD for `date` as seen in Manila. */
export function manilaDateString(date: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Earliest delivery date customers may pick: today in Manila plus the
 * minimum lead time, rounded up to whole days.
 */
export function earliestDeliveryDate(now: Date = new Date()): string {
  const days = Math.max(1, Math.ceil(siteConfig.ordering.minLeadTimeHours / 24));
  return manilaDateString(new Date(now.getTime() + days * 24 * 60 * 60 * 1000));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDeliveryDate(value: string, now: Date = new Date()): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  // String compare is safe for zero-padded ISO dates.
  return value >= earliestDeliveryDate(now);
}

/** "Sat, Nov 29" — short, human label for a YYYY-MM-DD date. */
export function formatDeliveryDate(value: string): string {
  if (!ISO_DATE.test(value)) return value;
  const d = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}
