"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { OrderStatus } from "@/types/domain";
import type { AdminOrder, AdminMenuItem } from "./admin-types";
import { AdminToolbar } from "./admin-toolbar";
import { OrderList } from "./order-list";
import { StockList } from "./stock-list";
import { OrderHistory } from "./order-history";
import { PrintSlip } from "./print-slip";

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

  // loadOrders/loadMenu are async; their setState calls happen after an
  // await, not synchronously. This effect syncs with external systems
  // (initial fetch, Supabase realtime channel, polling fallback), which
  // is what effects are for.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
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
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />

      <div className="print:hidden">
        <AdminToolbar
          lastUpdated={lastUpdated}
          readyCount={readyCount}
          onRefresh={loadOrders}
          onLogout={handleLogout}
        />

        <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 md:py-12">
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

          <OrderList
            activeOrders={activeOrders}
            totalActiveCount={allActiveOrders.length}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            updatingId={updatingId}
            onPrint={setPrintOrder}
            onCancelClick={setCancelTarget}
            onAdvanceStatus={updateStatus}
          />

          <StockList menuItems={menuItems} onToggleStock={toggleStock} />

          <OrderHistory
            pastOrders={pastOrders}
            historyLimit={historyLimit}
            onShowMore={() => setHistoryLimit((n) => n + 10)}
          />
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

      {printOrder && <PrintSlip order={printOrder} />}
    </>
  );
}
