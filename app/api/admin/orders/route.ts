import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isStaff } from "@/lib/supabase/is-staff";

const PAGE_SIZE = 50;

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isStaff(supabase))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  // Simple offset pagination via ?page=0,1,2... — previously hardcoded to
  // the newest 50 orders with no way to see older ones.
  const url = new URL(request.url);
  const page = Math.max(0, Number(url.searchParams.get("page") ?? 0) || 0);
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const service = createServiceClient();

  const { data: orders, error, count } = await service
    .from("orders")
    .select(
      `id, order_number, customer_name, customer_note, status, subtotal, created_at, updated_at,
       order_items ( id, item_name, selected_variant, unit_price, quantity, line_total )`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Gagal ambil daftar order:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar pesanan." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    orders,
    page,
    pageSize: PAGE_SIZE,
    total: count ?? orders?.length ?? 0,
  });
}
