"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { OrderStatus } from "@/types/domain";
import { BrandMark } from "@/components/brand/brand-mark";
import { AdminButton } from "@/components/admin/admin-button";

type AdminOrderItem = {
  id: string;
  item_name: string;
  selected_variant: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type AdminOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_note: string | null;
  status: OrderStatus;
  subtotal: number;
  created_at: string;
  updated_at: string;
  order_items: AdminOrderItem[];
};

type AdminMenuItem = {
  id: string;
  name: string;
  category: string;
  is_available: boolean;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Diterima",
  preparing: "Diproses",
  ready: "Siap Diambil",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// Every status now has a DISTINCT color, and status is never conveyed by
// color alone (labels + shape cues — bold weight, strikethrough — carry
// the same meaning for colorblind users / grayscale printouts).
const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "text-kopi-metal",
  preparing: "text-kopi-heritage",
  ready: "text-kopi-signage font-bold",
  completed: "text-kopi-ink-soft",
  cancelled: "text-kopi-ink-soft line-through decoration-1",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  received: "preparing",
  preparing: "ready",
  ready: "completed",
};

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "received", label: "Diterima" },
  { value: "preparing", label: "Diproses" },
  { value: "ready", label: "Siap Diambil" },
];

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByCategory(items: AdminMenuItem[]) {
  return items.reduce<Record<string, AdminMenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [printOrder, setPrintOrder] = useState<AdminOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [historyLimit, setHistoryLimit] = useState(10);

  const router = useRouter();
  const knownOrderIds = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      const nextOrders: AdminOrder[] = data.orders ?? [];

      // Fire an audible cue the moment a brand-new order lands, so staff
      // don't rely on noticing it visually while plating/printing.
      if (knownOrderIds.current.size > 0) {
        const hasNewOrder = nextOrders.some(
          (o) => !knownOrderIds.current.has(o.id) && o.status === "received",
        );
        if (hasNewOrder) {
          audioRef.current?.play().catch(() => {
            // Autoplay can be blocked before the first user interaction
            // on the page — acceptable; the visual banner still covers it.
          });
        }
      }
      knownOrderIds.current = new Set(nextOrders.map((o) => o.id));

      setOrders(nextOrders);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      setError("Gagal memuat pesanan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMenu = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/menu", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setMenuItems(data.items ?? []);
    } catch {
      // Stock panel is secondary to the order queue; fail quietly here,
      // the toggle buttons will simply show stale data until next load.
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadMenu();

    const supabase = createClient();
    const channel = supabase
      .channel("admin-orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadOrders(),
      )
      .subscribe();

    // Safety-net poll (slow) in case the realtime socket silently drops,
    // plus an immediate refetch whenever the tab regains focus — covers
    // the case where a backgrounded tab throttles timers for minutes.
    const interval = setInterval(loadOrders, 30000);
    function onVisibilityChange() {
      if (document.visibilityState === "visible") loadOrders();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [loadOrders, loadMenu]);

  // Print is triggered from state, not a hardcoded setTimeout — waits for
  // two paint frames so the print-only DOM node is guaranteed to exist,
  // and resets itself via the native afterprint event instead of leaking.
  useEffect(() => {
    if (!printOrder) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => window.print());
    });
    function handleAfterPrint() {
      setPrintOrder(null);
    }
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printOrder]);

  function handlePrint(order: AdminOrder) {
    setPrintOrder(order);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id);
    const previous = orders;
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status } : o)),
    );

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setOrders(previous);
      setError("Gagal memperbarui status pesanan.");
    }
    setUpdatingId(null);
  }

  function handleCancelClick(order: AdminOrder) {
    setCancelTarget(order);
  }

  function confirmCancel() {
    if (cancelTarget) updateStatus(cancelTarget.id, "cancelled");
    setCancelTarget(null);
  }

  async function toggleStock(id: string, isAvailable: boolean) {
    const previous = menuItems;
    setMenuItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, is_available: isAvailable } : item,
      ),
    );

    const res = await fetch(`/api/admin/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: isAvailable }),
    });

    if (!res.ok) {
      setMenuItems(previous);
      setError("Gagal memperbarui stok menu.");
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  // Ready orders always float to the top; everything else is FIFO —
  // matches how a real kitchen prioritizes work.
  const allActiveOrders = orders
    .filter((o) => o.status !== "completed" && o.status !== "cancelled")
    .sort((a, b) => {
      if (a.status === "ready" && b.status !== "ready") return -1;
      if (b.status === "ready" && a.status !== "ready") return 1;
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

  const activeOrders =
    statusFilter === "all"
      ? allActiveOrders
      : allActiveOrders.filter((o) => o.status === statusFilter);

  const pastOrders = orders
    .filter((o) => o.status === "completed" || o.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const readyCount = allActiveOrders.filter((o) => o.status === "ready").length;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />

      <div className="print:hidden">
        {/* ---- Slim admin toolbar (replaces the old inline logout link) ---- */}
        <header className="border-b border-kopi-line bg-kopi-bg-raised px-6 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <p className="font-display text-base text-kopi-ink tracking-tight">
              Kopitiam Tjoa{" "}
              <span className="font-utility text-[10px] uppercase tracking-widest text-kopi-ink-soft">
                Admin
              </span>
            </p>
            <div className="flex items-center gap-4">
              <span className="status-pill" aria-live="polite">
                <span className="dot dot--open" />
                {lastUpdated
                  ? `Diperbarui ${formatTime(lastUpdated.toISOString())}`
                  : "Memuat…"}
              </span>
              <AdminButton variant="ghost" size="sm" onClick={loadOrders}>
                Segarkan
              </AdminButton>
              <AdminButton variant="ghost" size="sm" onClick={handleLogout}>
                Keluar
              </AdminButton>
            </div>
          </div>
        </header>

        {/* Sticky, high-visibility banner — the single most time-sensitive
            fact in the whole dashboard is no longer a small text fragment. */}
        {readyCount > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="sticky top-0 z-10 bg-kopi-signage px-6 py-3 text-center font-utility text-sm font-bold uppercase tracking-widest text-kopi-bg"
          >
            {readyCount} pesanan siap diambil
          </div>
        )}

        <main
          id="main-content"
          className="mx-auto max-w-4xl px-6 py-10 md:py-12"
        >
          <h1 className="sr-only">Dashboard Pesanan</h1>

          {error && (
            <div
              className="mb-6 flex items-center justify-between gap-4 border border-kopi-signage bg-kopi-signage-soft px-4 py-3"
              role="alert"
              aria-live="assertive"
            >
              <p className="font-body text-sm text-kopi-signage">{error}</p>
              <button
                onClick={loadOrders}
                className="font-utility text-xs uppercase tracking-widest text-kopi-signage underline shrink-0"
              >
                Coba lagi
              </button>
            </div>
          )}

          <section className="mb-14">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-xl text-kopi-ink tracking-tight">
                Pesanan Aktif
                <span className="ml-2 font-utility text-xs align-middle text-kopi-ink-soft">
                  ({allActiveOrders.length})
                </span>
              </h2>

              {/* Filter chips — Hick's Law: let staff narrow the visible
                  set on demand instead of always scanning everything. */}
              <div
                className="flex gap-1.5"
                role="tablist"
                aria-label="Filter status pesanan"
              >
                {FILTERS.map((f) => (
                  <AdminButton
                    key={f.value}
                    variant={statusFilter === f.value ? "neutral" : "ghost"}
                    size="sm"
                    role="tab"
                    aria-selected={statusFilter === f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={
                      statusFilter === f.value
                        ? "text-kopi-ink! border-kopi-ink!"
                        : ""
                    }
                  >
                    {f.label}
                  </AdminButton>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="font-body text-sm text-kopi-ink-soft">Memuat...</p>
            ) : activeOrders.length === 0 ? (
              <p className="font-body text-sm text-kopi-ink-soft">
                {statusFilter === "all"
                  ? "Tidak ada pesanan aktif saat ini."
                  : "Tidak ada pesanan dengan status ini."}
              </p>
            ) : (
              <ul className="space-y-4">
                {activeOrders.map((order) => {
                  const next = NEXT_STATUS[order.status];
                  const isBusy = updatingId === order.id;
                  return (
                    <li key={order.id} className="ledger-entry p-5 md:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 pb-3 border-b border-dashed border-kopi-line">
                        <div>
                          <p className="font-display text-lg text-kopi-ink">
                            #{order.order_number}
                          </p>
                          <p className="font-body text-sm text-kopi-ink-soft">
                            {order.customer_name} &middot;{" "}
                            {formatTime(order.created_at)}
                          </p>
                        </div>
                        <span
                          className={`font-utility text-xs uppercase tracking-widest font-bold ${STATUS_COLOR[order.status]}`}
                        >
                          {STATUS_LABEL[order.status]}
                        </span>
                      </div>

                      <ul className="mb-4">
                        {order.order_items.map((item) => (
                          <li key={item.id} className="leader-row py-1.5">
                            <span className="font-body text-sm text-kopi-ink">
                              {item.quantity}× {item.item_name}
                              {item.selected_variant
                                ? ` (${item.selected_variant})`
                                : ""}
                            </span>
                            <span className="leader-fill" aria-hidden="true" />
                            <span className="font-utility text-sm tabular-nums text-kopi-ink">
                              {formatIDR(item.line_total)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {order.customer_note && (
                        <p className="mb-4 font-body text-sm italic text-kopi-ink-soft">
                          Catatan: {order.customer_note}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-utility text-base font-bold tabular-nums text-kopi-ink">
                          {formatIDR(order.subtotal)}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <AdminButton
                            variant="neutral"
                            size="md"
                            onClick={() => handlePrint(order)}
                            disabled={isBusy}
                          >
                            Cetak
                          </AdminButton>

                          {order.status !== "cancelled" && (
                            <AdminButton
                              variant="danger"
                              size="md"
                              onClick={() => handleCancelClick(order)}
                              disabled={isBusy}
                            >
                              Batalkan
                            </AdminButton>
                          )}

                          {next && (
                            <AdminButton
                              variant="success"
                              size="md"
                              onClick={() => updateStatus(order.id, next)}
                              disabled={isBusy}
                            >
                              {isBusy
                                ? "Menyimpan…"
                                : `Tandai ${STATUS_LABEL[next]}`}
                            </AdminButton>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="mb-14">
            <h2 className="font-display text-xl text-kopi-ink tracking-tight mb-4">
              Stok Menu
            </h2>
            <div className="ledger-entry p-5 md:p-6">
              {Object.entries(groupByCategory(menuItems)).map(
                ([category, items]) => (
                  <div key={category} className="mb-5 last:mb-0">
                    <p className="font-utility text-xs uppercase tracking-widest text-kopi-ink-soft mb-2">
                      {category}
                    </p>
                    <ul className="divide-y divide-kopi-line">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span className="font-body text-sm text-kopi-ink">
                            {item.name}
                          </span>
                          <button
                            onClick={() =>
                              toggleStock(item.id, !item.is_available)
                            }
                            className={`min-h-11 font-utility text-xs uppercase tracking-widest px-3 border transition-colors ${
                              item.is_available
                                ? "border-kopi-heritage-deep text-kopi-heritage-deep hover:bg-kopi-heritage-deep hover:text-kopi-bg"
                                : "border-kopi-signage text-kopi-signage hover:bg-kopi-signage hover:text-kopi-bg"
                            }`}
                          >
                            {item.is_available ? "Tersedia" : "Habis"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </section>

          {pastOrders.length > 0 && (
            <section>
              <h2 className="font-display text-xl text-kopi-ink tracking-tight mb-4">
                Riwayat Terkini
              </h2>
              <ul className="divide-y divide-kopi-line">
                {pastOrders.slice(0, historyLimit).map((order) => (
                  <li key={order.id} className="leader-row py-2">
                    <span className="font-body text-sm text-kopi-ink-soft">
                      #{order.order_number} &middot; {order.customer_name}
                    </span>
                    <span className="leader-fill" aria-hidden="true" />
                    <span
                      className={`font-utility text-xs uppercase tracking-widest ${
                        order.status === "cancelled"
                          ? "text-kopi-ink-soft line-through"
                          : "text-kopi-ink-soft"
                      }`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </li>
                ))}
              </ul>
              {pastOrders.length > historyLimit && (
                <button
                  onClick={() => setHistoryLimit((n) => n + 10)}
                  className="mt-4 font-utility text-xs uppercase tracking-widest text-kopi-ink-soft underline min-h-11"
                >
                  Tampilkan lebih banyak
                </button>
              )}
            </section>
          )}
        </main>
      </div>

      {cancelTarget && (
        <ConfirmDialog
          title={`Batalkan #${cancelTarget.order_number}?`}
          description={`Pesanan atas nama ${cancelTarget.customer_name} akan dibatalkan. Aksi ini tidak bisa diurungkan.`}
          confirmLabel="Ya, Batalkan"
          destructive
          onConfirm={confirmCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}

      {printOrder && (
        <div className="print-slip hidden print:block font-utility text-kopi-ink mx-auto max-w-[320px]">
          <BrandMark className="h-8 w-8 mx-auto mb-1.5" />
          <p className="text-center text-base font-bold tracking-wide mb-0.5">
            KOPITIAM TJOA
          </p>
          <p className="text-center text-[10px] tracking-widest mb-1">
            EST. 1968 &middot; JL. KEMBANG JEPUN, SURABAYA
          </p>
          <p className="text-center text-[10px] mb-3">
            - - - - - - - - - - - - - - -
          </p>

          <p className="text-center text-lg font-bold mb-1">
            #{printOrder.order_number}
          </p>
          <div className="flex justify-between text-xs mb-3">
            <span>{printOrder.customer_name}</span>
            <span>{formatTime(printOrder.created_at)}</span>
          </div>

          <p className="text-[10px] mb-2">- - - - - - - - - - - - - - -</p>

          {printOrder.order_items.map((item) => (
            <div key={item.id} className="text-xs mb-2">
              <div className="flex justify-between">
                <span>
                  {item.quantity}× {item.item_name}
                </span>
                <span>{formatIDR(item.line_total)}</span>
              </div>
              {item.selected_variant && (
                <p className="text-[10px] text-kopi-ink-soft pl-3">
                  {item.selected_variant}
                </p>
              )}
            </div>
          ))}

          <p className="text-[10px] my-2">- - - - - - - - - - - - - - -</p>

          <div className="flex justify-between text-xs mb-0.5">
            <span>Jumlah item</span>
            <span>
              {printOrder.order_items.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL</span>
            <span>{formatIDR(printOrder.subtotal)}</span>
          </div>

          {printOrder.customer_note && (
            <p className="text-[10px] italic mt-3 pt-2 border-t border-dotted border-kopi-ink">
              Catatan: {printOrder.customer_note}
            </p>
          )}

          <p className="text-center text-[10px] mt-4">
            - - - - - - - - - - - - - - -
          </p>
          <p className="text-center text-xs mt-2">
            Terima kasih atas pesanan Anda!
          </p>
        </div>
      )}
    </>
  );
}
