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
 */
export function getOpenStatus(
  hours: BusinessHours,
  manualOverride: boolean | null,
  now: Date = new Date(),
): OpenStatus {
  const todayKey = DAY_KEYS[now.getDay()];
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

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return { isOpen, label: isOpen ? "BUKA" : "TUTUP", reason: "hours", today };
}
