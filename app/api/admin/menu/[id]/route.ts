import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

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
