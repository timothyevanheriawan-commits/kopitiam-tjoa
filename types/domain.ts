// types/domain.ts

// ---------- Business hours ----------
export type DayHours = {
  open: string | null;
  close: string | null;
  closed: boolean;
};

export type BusinessHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

// ---------- Orders ----------
export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

// ---------- Menu ----------
export type MenuCategory =
  | "kopi_teh"
  | "roti_kaya"
  | "telur"
  | "snacks_kueh"
  | "combo_sets";
  
export type VariantOption = {
  label: string;
  price_delta: number;
};

export type VariantOptionGroup = {
  name: string;
  options: VariantOption[];
};

export type MenuItem = {
  id: string;
  category: MenuCategory;
  created_at: string;
  description: string | null;
  is_available: boolean;
  name: string;
  price: number;
  sort_order: number;
  tags: string[];
  variant_options: VariantOptionGroup[] | null;
};
