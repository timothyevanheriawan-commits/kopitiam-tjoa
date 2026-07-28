import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isStaff } from "@/lib/supabase/is-staff";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Being logged in is not enough — must be an explicit staff member.
  // See supabase/schema.sql (`staff` table / `is_staff()`).
  if (!user || !(await isStaff(supabase))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: items, error } = await service
    .from("menu_items")
    .select("id, name, category, is_available")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Gagal ambil daftar menu:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar menu." },
      { status: 500 },
    );
  }

  return NextResponse.json({ items });
}
