import type { OrderStatus } from "@/types/domain";
import type { AdminOrder } from "./admin-types";
import { OrderFilters } from "./order-filters";
import { OrderCard } from "./order-card";

export function OrderList({
  activeOrders,
  totalActiveCount,
  isLoading,
  statusFilter,
  onFilterChange,
  updatingId,
  onPrint,
  onCancelClick,
  onAdvanceStatus,
}: {
  activeOrders: AdminOrder[];
  totalActiveCount: number;
  isLoading: boolean;
  statusFilter: OrderStatus | "all";
  onFilterChange: (value: OrderStatus | "all") => void;
  updatingId: string | null;
  onPrint: (order: AdminOrder) => void;
  onCancelClick: (order: AdminOrder) => void;
  onAdvanceStatus: (id: string, next: OrderStatus) => void;
}) {
  return (
    <section className="mb-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl text-kopi-ink tracking-tight">
          Pesanan Aktif
          <span className="ml-2 font-utility text-xs align-middle text-kopi-ink-soft">
            ({totalActiveCount})
          </span>
        </h2>
        <OrderFilters value={statusFilter} onChange={onFilterChange} />
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
          {activeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isBusy={updatingId === order.id}
              onPrint={onPrint}
              onCancelClick={onCancelClick}
              onAdvanceStatus={onAdvanceStatus}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
