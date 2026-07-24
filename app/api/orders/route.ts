// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  checkRateLimit,
  getClientIp,
  recordOrderAttempt,
} from "@/lib/rate-limit";

interface OrderItemInput {
  menuItemId: string;
  selectedVariant: string | null;
  quantity: number;
}

interface CreateOrderInput {
  customerName: string;
  customerNote: string | null;
  items: OrderItemInput[];
}

export async function POST(request: Request) {
  let body: CreateOrderInput;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const customerName = body.customerName?.trim();
  const items = body.items;

  if (!customerName) {
    return NextResponse.json(
      { error: "Nama pemesan wajib diisi." },
      { status: 400 },
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Keranjang pesanan kosong." },
      { status: 400 },
    );
  }

  for (const item of items) {
    if (!item.menuItemId || !item.quantity || item.quantity < 1) {
      return NextResponse.json(
        { error: "Salah satu item pesanan tidak valid." },
        { status: 400 },
      );
    }
  }

  // BARU: cegah spam order dari 1 sumber yang sama.
  const clientIp = getClientIp(request);
  const withinLimit = await checkRateLimit(clientIp);
  if (!withinLimit) {
    return NextResponse.json(
      {
        error:
          "Terlalu banyak pesanan dari perangkat ini dalam waktu singkat, mohon tunggu beberapa menit.",
      },
      { status: 429 },
    );
  }
  const supabase = createServiceClient();

  // Ambil ulang harga dan ketersediaan dari server — TIDAK percaya
  // harga yang dikirim client, ini pertahanan utama tanpa payment gateway.
  const menuItemIds = items.map((i) => i.menuItemId);
  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, price, is_available, variant_options")
    .in("id", menuItemIds);

  if (menuError) {
    return NextResponse.json(
      { error: "Gagal memverifikasi data menu." },
      { status: 500 },
    );
  }

  const menuItemMap = new Map(menuItems?.map((m) => [m.id, m]) ?? []);
  const unavailableItems: string[] = [];
  const orderItemRows: {
    menu_item_id: string;
    item_name: string;
    selected_variant: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[] = [];

  let subtotal = 0;

  for (const item of items) {
    const menuItem = menuItemMap.get(item.menuItemId);

    if (!menuItem) {
      return NextResponse.json(
        { error: "Salah satu item tidak ditemukan di menu." },
        { status: 400 },
      );
    }

    if (!menuItem.is_available) {
      unavailableItems.push(menuItem.name);
      continue;
    }

    let unitPrice = menuItem.price;

    if (item.selectedVariant && menuItem.variant_options) {
      // variant_options sekarang berbentuk grup ({name, options[]}),
      // bukan array datar — cocokkan label di seluruh grup.
      const groups = menuItem.variant_options as {
        name: string;
        options: { label: string; price_delta: number }[];
      }[];
      const flatOptions = groups.flatMap((g) => g.options);
      const variant = flatOptions.find((v) => v.label === item.selectedVariant);
      if (variant) {
        unitPrice += variant.price_delta;
      }
    }

    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    orderItemRows.push({
      menu_item_id: menuItem.id,
      item_name: menuItem.name,
      selected_variant: item.selectedVariant,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: lineTotal,
    });
  }

  // Item habis ditemukan saat validasi ulang — beri tahu customer
  // dengan jelas item mana, bukan gagal generik.
  if (unavailableItems.length > 0) {
    return NextResponse.json(
      {
        error: "Beberapa item sudah habis, mohon perbarui pesanan.",
        unavailableItems,
      },
      { status: 409 },
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_note: body.customerNote?.trim() || null,
      subtotal,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("Insert order gagal:", orderError);
    return NextResponse.json(
      { error: "Gagal membuat pesanan, coba lagi." },
      { status: 500 },
    );
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemRows.map((row) => ({ ...row, order_id: order.id })));

  if (itemsError) {
    console.error("Insert order_items gagal:", itemsError);
    // Order sudah terlanjur dibuat tanpa item — hapus supaya tidak
    // ada order "hantu" tanpa isi di dashboard staff.
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "Gagal menyimpan detail pesanan, coba lagi." },
      { status: 500 },
    );
  }

  await recordOrderAttempt(clientIp);

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
  });
}
