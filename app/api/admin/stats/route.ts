import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isStaff } from "@/lib/supabase/is-staff";
import { getWibDayBoundsUtc } from "@/lib/hours";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isStaff(supabase))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { startUtc, endUtc } = getWibDayBoundsUtc();
  const service = createServiceClient();

  const { data, error } = await service
    .from("orders")
    .select("subtotal, status")
    .gte("created_at", startUtc)
    .lt("created_at", endUtc);

  if (error) {
    console.error("Gagal ambil statistik:", error);
    return NextResponse.json(
      { error: "Gagal memuat statistik." },
      { status: 500 },
    );
  }

  // Cancelled orders never happened commercially — excluded from both
  // the count and the revenue total, same convention as the dashboard's
  // "Riwayat Terkini" strikethrough treatment for cancelled orders.
  const counted = (data ?? []).filter((o) => o.status !== "cancelled");
  const orderCount = counted.length;
  const revenue = counted.reduce((sum, o) => sum + o.subtotal, 0);

  return NextResponse.json({ orderCount, revenue });
}
