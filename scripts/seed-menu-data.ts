// scripts/seed-menu-data.ts
import type { MenuTag } from "../lib/tags";
import type { VariantOptionGroup } from "../types/domain";

export interface SeedMenuItem {
  category: "kopi_teh" | "roti_kaya" | "telur" | "snacks_kueh" | "combo_sets";
  name: string;
  description: string | null;
  price: number;
  variant_options: VariantOptionGroup[] | null;
  tags: MenuTag[];
  is_available: boolean;
  sort_order: number;
}

const KOPI_VARIANT_GROUP: VariantOptionGroup[] = [
  {
    name: "Jenis Kopi",
    options: [
      { label: "Kopi Tubruk", price_delta: 0 },
      { label: "Kopi Saring", price_delta: 0 },
    ],
  },
];

export const SEED_MENU_ITEMS: SeedMenuItem[] = [
  // ---- Kopi & Teh ----
  {
    category: "kopi_teh",
    name: "Kopi O",
    description: "Kopi tubruk hitam, gula aren.",
    price: 8000,
    variant_options: KOPI_VARIANT_GROUP,
    tags: [],
    is_available: true,
    sort_order: 0,
  },
  {
    category: "kopi_teh",
    name: "Kopi Susu Tjoa",
    description: "Ratio yang sama sejak 1968.",
    price: 12000,
    variant_options: KOPI_VARIANT_GROUP,
    tags: ["signature"],
    is_available: true,
    sort_order: 1,
  },
  {
    category: "kopi_teh",
    name: "Kopi Tarik",
    description: "Ditarik, berbusa, manis pas.",
    price: 13000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 2,
  },
  {
    category: "kopi_teh",
    name: "Teh O",
    description: null,
    price: 7000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 3,
  },
  {
    category: "kopi_teh",
    name: "Teh Tarik",
    description: null,
    price: 10000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 4,
  },
  {
    category: "kopi_teh",
    name: "Es Kopi Susu",
    description: "Versi dingin Kopi Susu Tjoa.",
    price: 14000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 5,
  },

  // ---- Roti & Kaya ----
  {
    category: "roti_kaya",
    name: "Roti Bakar Srikaya",
    description: "Dipanggang arang, kaya buatan sendiri.",
    price: 12000,
    variant_options: null,
    tags: ["best_seller"],
    is_available: true,
    sort_order: 6,
  },
  {
    category: "roti_kaya",
    name: "Roti Bakar Coklat Keju",
    description: null,
    price: 13000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 7,
  },
  {
    category: "roti_kaya",
    name: "Roti Bakar Original",
    description: "Mentega, gula pasir.",
    price: 10000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 8,
  },

  // ---- Telur ----
  {
    category: "telur",
    name: "Telur Setengah Matang",
    description: "Dua butir, kecap manis, lada putih.",
    price: 8000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 9,
  },

  // ---- Snacks & Kueh ----
  {
    category: "snacks_kueh",
    name: "Kueh Lapis",
    description: "Per potong.",
    price: 6000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 10,
  },
  {
    category: "snacks_kueh",
    name: "Pisang Goreng",
    description: "Tiga potong.",
    price: 9000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 11,
  },
  {
    category: "snacks_kueh",
    name: "Kacang Tanah Rebus",
    description: null,
    price: 5000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 12,
  },

  // ---- Combo Sets ----
  {
    category: "combo_sets",
    name: "Set Klasik",
    description:
      "Kopi Susu Tjoa + Roti Bakar Srikaya + Telur Setengah Matang. Hemat Rp 4.000.",
    price: 28000,
    variant_options: null,
    tags: ["signature"],
    is_available: true,
    sort_order: 13,
  },
  {
    category: "combo_sets",
    name: "Set Ringan",
    description: "Teh Tarik + Roti Bakar Original.",
    price: 18000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 14,
  },
  {
    category: "combo_sets",
    name: "Set Pagi",
    description: "Kopi O + Telur Setengah Matang + Kueh Lapis.",
    price: 20000,
    variant_options: null,
    tags: [],
    is_available: true,
    sort_order: 15,
  },
];
