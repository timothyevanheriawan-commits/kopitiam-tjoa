import type { BusinessHours, DayHours } from "@/types/domain";

const DAY_KEYS: (keyof BusinessHours)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Indonesia has no DST, so WIB is always a fixed UTC+7 offset.
// Server runtimes (Vercel) run in UTC, so we must shift `now` before
// reading getDay()/getHours()/getMinutes() from it — otherwise every
// day/hour read here silently means "in UTC", not "in WIB".
const WIB_OFFSET_MINUTES = 7 * 60;

function toWibParts(now: Date) {
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const wibMinutesOfDay = (utcMinutes + WIB_OFFSET_MINUTES) % (24 * 60);

  // Day rolls over if adding the offset pushed us past midnight UTC.
  const dayRolledOver =
    now.getUTCHours() * 60 + now.getUTCMinutes() + WIB_OFFSET_MINUTES >=
    24 * 60;

  const wibDay = new Date(now);
  wibDay.setUTCDate(now.getUTCDate() + (dayRolledOver ? 1 : 0));

  return {
    dayIndex: wibDay.getUTCDay(),
    minutesOfDay: wibMinutesOfDay,
  };
}

export interface OpenStatus {
  isOpen: boolean;
  label: "BUKA" | "TUTUP";
  reason: "manual_override" | "hours" | "closed_today";
  today: DayHours;
}

/**
 * Determines open/closed status. A manual override (set from the admin
 * panel) always wins over the hours table — this is the "closes early
 * sometimes" escape hatch small businesses actually need.
 *
 * All time reads are done in WIB (UTC+7), regardless of the server's
 * own runtime timezone.
 */
export function getOpenStatus(
  hours: BusinessHours,
  manualOverride: boolean | null,
  now: Date = new Date(),
): OpenStatus {
  const { dayIndex, minutesOfDay } = toWibParts(now);
  const todayKey = DAY_KEYS[dayIndex];
  const today = hours[todayKey];

  if (manualOverride !== null) {
    return {
      isOpen: manualOverride,
      label: manualOverride ? "BUKA" : "TUTUP",
      reason: "manual_override",
      today,
    };
  }

  if (today.closed || !today.open || !today.close) {
    return { isOpen: false, label: "TUTUP", reason: "closed_today", today };
  }

  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = minutesOfDay >= openMinutes && minutesOfDay < closeMinutes;

  return { isOpen, label: isOpen ? "BUKA" : "TUTUP", reason: "hours", today };
}
export function getWibDayKey(now: Date = new Date()): keyof BusinessHours {
  const { dayIndex } = toWibParts(now);
  return DAY_KEYS[dayIndex];
}

/**
 * Returns the UTC instants marking the start (inclusive) and end
 * (exclusive) of "today" as a WIB wall-clock day. Use this to query
 * timestamptz columns for "today's orders" — comparing against a UTC
 * midnight boundary would silently be off by 7 hours.
 */
export function getWibDayBoundsUtc(now: Date = new Date()): {
  startUtc: string;
  endUtc: string;
} {
  const wibWallClock = new Date(now.getTime() + WIB_OFFSET_MINUTES * 60_000);
  const y = wibWallClock.getUTCFullYear();
  const m = wibWallClock.getUTCMonth();
  const d = wibWallClock.getUTCDate();

  const startUtcMs =
    Date.UTC(y, m, d, 0, 0, 0) - WIB_OFFSET_MINUTES * 60_000;
  const endUtcMs = startUtcMs + 24 * 60 * 60_000;

  return {
    startUtc: new Date(startUtcMs).toISOString(),
    endUtc: new Date(endUtcMs).toISOString(),
  };
}