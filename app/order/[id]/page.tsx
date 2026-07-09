// app/order/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { OrderStatusView } from "@/components/order/order-status-view";
import type { OrderStatus } from "@/types/domain";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

interface OrderStatusData {
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  subtotal: number;
  created_at: string;
  items: {
    itemName: string;
    selectedVariant: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}

function isOrderStatus(value: string): value is OrderStatus {
  return VALID_STATUSES.includes(value as OrderStatus);
}

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return <NotFoundState />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_order_status", { p_order_id: id })
    .maybeSingle();

  if (error || !data || !isOrderStatus(data.status)) {
    return <NotFoundState />;
  }

  return <OrderStatusView orderId={id} initialData={data as OrderStatusData} />;
}

function NotFoundState() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <span className="font-utility text-xs uppercase tracking-widest text-kopi-signage font-bold block mb-3">
          404
        </span>
        <h1 className="font-display text-2xl text-kopi-ink tracking-tight mb-3">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="font-body text-sm text-kopi-ink-soft leading-relaxed">
          Tautan yang Anda buka tidak valid atau pesanan sudah tidak tersimpan.
          Periksa kembali tautan dari konfirmasi pesanan Anda.
        </p>
      </div>
    </main>
  );
}
