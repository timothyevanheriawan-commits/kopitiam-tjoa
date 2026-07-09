import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: orders, error } = await service
    .from("orders")
    .select(
      `id, order_number, customer_name, customer_note, status, subtotal, created_at, updated_at,
       order_items ( id, item_name, selected_variant, unit_price, quantity, line_total )`,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Gagal ambil daftar order:", error);
    return NextResponse.json(
      { error: "Gagal memuat daftar pesanan." },
      { status: 500 },
    );
  }

  return NextResponse.json({ orders });
}
