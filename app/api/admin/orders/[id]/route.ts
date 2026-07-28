import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isStaff } from "@/lib/supabase/is-staff";
import type { OrderStatus } from "@/types/domain";

const VALID_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

// Defense-in-depth CSRF check: reject state-changing requests whose Origin
// doesn't match this deployment. SameSite cookies already cover the common
// case, but this doesn't rely on cookie behavior at all.
function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin browser navigations may omit Origin
  const allowed = new URL(request.url).origin;
  return origin === allowed;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.json({ error: "Permintaan ditolak." }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isStaff(supabase))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

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

  // Audit trail — previously the order_status_history table existed in the
  // schema but nothing ever wrote to it.
  const { error: historyError } = await service
    .from("order_status_history")
    .insert({ order_id: id, status, changed_by: user.email ?? user.id });

  if (historyError) {
    // Non-fatal: the status update already succeeded, don't fail the
    // request just because the audit log write failed.
    console.error("Gagal mencatat riwayat status order:", historyError);
  }

  return NextResponse.json({ success: true });
}
