// lib/constants.ts
import type { BusinessHours } from "@/types/domain";

// Single source of truth for the shop's map location. For an exact pin,
// replace the query with "LAT,LNG" (right-click the shop in Google Maps
// and click the coordinates to copy them). The embed, the location card
// button, and the footer link all derive from this one value.
export const SHOP_MAPS_QUERY = "Jl. Kembang Jepun, Surabaya";
export const SHOP_MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(SHOP_MAPS_QUERY)}&z=17&output=embed`;
export const SHOP_MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_MAPS_QUERY)}`;

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
