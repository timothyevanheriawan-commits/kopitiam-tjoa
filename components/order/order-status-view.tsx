"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/types/domain";
import { BrandMark } from "../brand/brand-mark";

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

// Raw shape returned by the `get_order_status` RPC (snake_case, matches
// the Postgres column names). Never render this directly — always pass
// it through mapOrderData first, or you'll get `undefined` on every
// item field and crash formatIDR().
interface RawOrderStatusData extends Omit<OrderStatusData, "items"> {
  items: {
    item_name: string;
    selected_variant: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
}

// Single point of translation between the RPC's snake_case item shape
// and the camelCase shape this component works with. Both the initial
// server-fetched data and every polling refresh go through this, so
// there's exactly one place to fix if the RPC's shape ever changes again.
function mapOrderData(raw: RawOrderStatusData): OrderStatusData {
  return {
    ...raw,
    items: raw.items.map((item) => ({
      itemName: item.item_name,
      selectedVariant: item.selected_variant,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
    })),
  };
}

const STATUS_STEPS = [
  { key: "received", label: "Diterima" },
  { key: "preparing", label: "Diproses" },
  { key: "ready", label: "Siap Diambil" },
  { key: "completed", label: "Selesai" },
] as const;

// Single source of truth for the "what's happening right now" label —
// this used to be a hardcoded string that silently went stale as the
// order progressed. Never duplicate a status label as a literal string
// elsewhere on this page again.
const STATUS_MESSAGE: Record<OrderStatus, string> = {
  received: "Pesanan Diterima",
  preparing: "Sedang Diproses",
  ready: "Siap Diambil",
  completed: "Pesanan Selesai",
  cancelled: "Pesanan Dibatalkan",
};

// Only genuinely urgent states get the alarm color. A calm confirmation
// ("received") or a positive resolution ("completed") should never wear
// the same red as "come get this now" or "something went wrong" — that
// was overloading one color with contradictory meanings.
const STATUS_TAG_COLOR: Record<OrderStatus, string> = {
  received: "text-kopi-ink-soft",
  preparing: "text-kopi-heritage",
  ready: "text-kopi-signage",
  completed: "text-kopi-heritage",
  cancelled: "text-kopi-signage",
};

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderStatusView({
  orderId,
  initialData,
}: {
  orderId: string;
  initialData: RawOrderStatusData;
}) {
  const [data, setData] = useState(() => mapOrderData(initialData));
  const [copyLabel, setCopyLabel] = useState("Salin Tautan");
  const previousStatus = useRef(data.status);

  useEffect(() => {
    if (data.status === "completed" || data.status === "cancelled") return;

    const supabase = createClient();
    const interval = setInterval(async () => {
      const { data: fresh, error } = await supabase
        .rpc("get_order_status", { p_order_id: orderId })
        .maybeSingle();

      if (!error && fresh) {
        setData(mapOrderData(fresh as RawOrderStatusData));
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [orderId, data.status]);

  useEffect(() => {
    previousStatus.current = data.status;
  }, [data.status]);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopyLabel("Tautan Disalin");
    setTimeout(() => setCopyLabel("Salin Tautan"), 2500);
  }

  const isCancelled = data.status === "cancelled";
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === data.status);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <div className="text-center pb-6 mb-10 border-b border-dashed border-kopi-line">
        {/* Derived from live status, not a hardcoded string — this is
            the fact this whole page exists to communicate, it must
            never be able to disagree with the progress bar below it. */}
        <span
          className={`index-tag mb-3! justify-center flex ${STATUS_TAG_COLOR[data.status]}`}
          aria-live="polite"
        >
          {STATUS_MESSAGE[data.status]}
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-kopi-ink tracking-tight mb-2">
          #{data.order_number}
        </h1>
        <p className="font-body text-sm text-kopi-ink-soft">
          Atas nama {data.customer_name}
        </p>
        <p className="font-utility text-[10px] uppercase tracking-widest text-kopi-ink-soft mt-1">
          {formatOrderDate(data.created_at)}
        </p>
      </div>

      {data.status === "received" && (
        <div className="stamp-in ledger-entry mb-10 flex flex-col items-center gap-3 p-6 text-center md:p-8">
          <BrandMark className="h-10 w-10" />
          <p className="font-display text-xl text-kopi-heritage tracking-tight md:text-2xl">
            Terima Kasih Sudah Memesan!
          </p>
          <p className="max-w-sm font-body text-sm leading-relaxed text-kopi-ink-soft">
            Pesanan Anda sedang kami siapkan dengan resep yang sama sejak
            gerobak pertama di Pasar Turi, 1968. Pantau statusnya di halaman
            ini.
          </p>
        </div>
      )}
      {data.status === "completed" && (
        <div className="stamp-in ledger-entry mb-10 flex flex-col items-center gap-3 p-6 text-center md:p-8">
          <BrandMark className="h-10 w-10" />
          <p className="font-display text-xl text-kopi-heritage tracking-tight md:text-2xl">
            Selamat Menikmati!
          </p>
          <p className="max-w-sm font-body text-sm leading-relaxed text-kopi-ink-soft">
            Terima kasih sudah mampir ke Kopitiam Tjoa. Sampai jumpa lagi di
            kunjungan berikutnya.
          </p>
        </div>
      )}

      {/* aria-live wraps the whole progress region so a status change
          arriving via polling — e.g. staff marks it "Siap Diambil" or
          cancels it while the customer is mid-read — gets announced to
          screen reader users instead of silently updating underneath them. */}
      <div aria-live="polite" aria-atomic="true">
        {isCancelled ? (
          <div
            role="alert"
            className="border border-kopi-signage bg-kopi-signage-soft px-5 py-4 text-center mb-10"
          >
            <p className="font-body text-sm font-bold text-kopi-signage">
              Pesanan ini telah dibatalkan.
            </p>
          </div>
        ) : (
          <ol className="flex items-start justify-between mb-10">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <li key={step.key} className="flex-1 flex items-start">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center border-2 font-utility text-xs font-bold transition-colors ${
                        isDone
                          ? "border-kopi-heritage bg-kopi-heritage text-kopi-bg"
                          : isCurrent
                            ? "border-kopi-signage bg-kopi-bg text-kopi-signage"
                            : "border-kopi-line text-kopi-ink-soft"
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <span
                      className={`mt-2 font-utility text-[10px] uppercase tracking-wider text-center ${
                        isCurrent
                          ? "text-kopi-signage font-bold"
                          : isDone
                            ? "text-kopi-ink font-bold"
                            : "text-kopi-ink-soft"
                      }`}
                    >
                      {step.label}
                      {isCurrent && (
                        <span className="sr-only"> — status saat ini</span>
                      )}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`mt-4 h-0 flex-1 border-t-2 border-dotted ${
                        i < currentStepIndex
                          ? "border-kopi-heritage"
                          : "border-kopi-line"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="ledger-entry p-6 md:p-8">
        <h2 className="font-display text-lg text-kopi-ink tracking-tight mb-4">
          Rincian Pesanan
        </h2>
        <ul className="divide-y divide-kopi-line">
          {data.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 py-2.5"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-body text-sm font-semibold text-kopi-ink leading-tight">
                  {item.quantity}× {item.itemName}
                </p>
                {item.selectedVariant && (
                  <p className="font-body text-xs text-kopi-ink-soft mt-0.5 wrap-break-word">
                    {item.selectedVariant}
                  </p>
                )}
              </div>
              {/* font-utility + tabular-nums — matches the sitewide
                  numeric-typography convention (admin dashboard, cart). */}
              <span className="whitespace-nowrap font-utility text-sm font-semibold tabular-nums text-kopi-ink">
                {formatIDR(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-kopi-line flex items-center justify-between">
          <span className="font-body text-sm text-kopi-ink-soft">Total</span>
          <span className="font-utility text-lg font-bold tabular-nums text-kopi-ink">
            {formatIDR(data.subtotal)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-center font-body text-xs text-kopi-ink-soft">
          Simpan tautan halaman ini untuk memantau status pesanan Anda.
        </p>
        <button
          type="button"
          onClick={handleCopyLink}
          className="font-utility text-xs uppercase tracking-widest text-kopi-heritage underline min-h-11 px-2"
        >
          {copyLabel}
        </button>
      </div>
    </main>
  );
}
