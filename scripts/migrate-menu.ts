// scripts/migrate-menu.ts
// Jalankan sekali: npx tsx scripts/migrate-menu.ts
// Membaca SEED_MENU_ITEMS (data statis hasil transkrip) dan insert ke
// tabel menu_items. TIDAK memakai getMenuBoard(), karena fungsi itu
// sekarang membaca dari Supabase — memakainya di sini akan membaca
// tabel yang justru masih kosong.

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { SEED_MENU_ITEMS } from "./seed-menu-data";
import type { Database } from "../types/database";

// Baca .env.local secara manual — tidak bergantung pada dotenv atau
// flag CLI tertentu, supaya konsisten di semua versi Node/OS.
function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed
        .slice(eqIndex + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local tidak ditemukan — lanjut, siapa tahu env sudah di-set manual
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Env var NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum di-set.\n" +
      "Pastikan file .env.local ada di root project dan berisi kedua variabel ini.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log(`Mengirim ${SEED_MENU_ITEMS.length} item menu ke Supabase...`);

  const { error, count } = await supabase
    .from("menu_items")
    .insert(SEED_MENU_ITEMS, { count: "exact" });

  if (error) {
    console.error("Migrasi gagal:", error.message);
    process.exit(1);
  }

  console.log(`Berhasil: ${count} item menu dimasukkan ke tabel menu_items.`);
}

main();
