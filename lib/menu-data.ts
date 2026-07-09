// lib/menu-data.ts
// Server-side data access for the public menu board. Replaces the earlier
// placeholder MENU array with a real fetch against menu_items, grouped
// and ordered the way the menu board expects to render them.
import { createClient } from "@/lib/supabase/server";
import type { MenuCategory, MenuItem } from "@/types/domain";

export interface MenuCategoryGroup {
  key: MenuCategory;
  label: string;
  items: MenuItem[];
}

// Display order and labels are a presentation concern, not something we
// want to infer from the database (category is just an enum column), so
// they stay hand-defined here rather than coming from Supabase.
const CATEGORY_ORDER: MenuCategory[] = [
  "kopi_teh",
  "roti_kaya",
  "telur",
  "snacks_kueh",
  "combo_sets",
];

const CATEGORY_LABELS: Record<MenuCategory, string> = {
  kopi_teh: "Kopi & Teh",
  roti_kaya: "Roti & Kaya",
  telur: "Telur",
  snacks_kueh: "Snacks & Kueh",
  combo_sets: "Combo Sets",
};

/**
 * Fetches all menu_items and groups them by category in the fixed display
 * order above. Categories with no items are omitted rather than shown
 * empty. Returns an empty array (rather than throwing) on fetch failure,
 * so the menu page can render an honest "not available right now" state
 * instead of crashing the whole route.
 */
export async function getMenuBoard(): Promise<MenuCategoryGroup[]> {
  const supabase = await createClient();

  // .returns<>() overrides postgrest-js's string-literal inference on
  // select("*"), which is unreliable against a hand-written (rather than
  // `supabase gen types`-generated) Database type. See types/database.ts.
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<MenuItem[]>();

  if (error) {
    console.error("getMenuBoard: failed to fetch menu_items:", error.message);
    return [];
  }

  const items = data ?? [];

  return CATEGORY_ORDER.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    items: items.filter((item) => item.category === key),
  })).filter((group) => group.items.length > 0);
}
