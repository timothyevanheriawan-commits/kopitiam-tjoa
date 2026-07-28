import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isStaff } from "@/lib/supabase/is-staff";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isStaff(supabase))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await params;

  let body: { is_available?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const isAvailable = Boolean(body.is_available);

  const service = createServiceClient();

  const { error } = await service
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) {
    console.error("Gagal update stok menu:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui stok." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
