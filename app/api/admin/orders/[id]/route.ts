import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { OrderStatus } from "@/types/domain";

const VALID_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as OrderStatus;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const service = createServiceClient();

  const { error } = await service
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Gagal update status order:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status pesanan." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
