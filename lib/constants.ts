// lib/constants.ts
import type { BusinessHours } from "@/types/domain";

// Placeholder default hours matching supabase/schema.sql's seed row.
// Will be replaced by a fetch from business_settings once Supabase is wired up.
export const DEFAULT_HOURS: BusinessHours = {
  monday: { open: "05:00", close: "15:00", closed: false },
  tuesday: { open: "05:00", close: "15:00", closed: false },
  wednesday: { open: "05:00", close: "15:00", closed: false },
  thursday: { open: "05:00", close: "15:00", closed: false },
  friday: { open: "05:00", close: "15:00", closed: false },
  saturday: { open: "05:00", close: "13:00", closed: false },
  sunday: { open: null, close: null, closed: true },
};
