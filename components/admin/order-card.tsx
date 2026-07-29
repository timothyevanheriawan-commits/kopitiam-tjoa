import type { OrderStatus } from "@/types/domain";
import { AdminButton } from "@/components/admin/admin-button";
import type { AdminOrder } from "./admin-types";
import { STATUS_COLOR, STATUS_LABEL, NEXT_STATUS, formatIDR, formatTime } from "./admin-display";

export function OrderCard({
  order,
  isBusy,
  onPrint,
  onCancelClick,
  onAdvanceStatus,
}: {
  order: AdminOrder;
  isBusy: boolean;
  onPrint: (order: AdminOrder) => void;
  onCancelClick: (order: AdminOrder) => void;
  onAdvanceStatus: (id: string, next: OrderStatus) => void;
}) {
  const next = NEXT_STATUS[order.status];

  return (
    <li className="ledger-entry p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 pb-3 border-b border-dashed border-kopi-line">
        <div>
          <p className="font-display text-lg text-kopi-ink">
            #{order.order_number}
          </p>
          <p className="font-body text-sm text-kopi-ink-soft">
            {order.customer_name} &middot; {formatTime(order.created_at)}
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
              {item.selected_variant ? ` (${item.selected_variant})` : ""}
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
            onClick={() => onPrint(order)}
            disabled={isBusy}
          >
            Cetak
          </AdminButton>

          {order.status !== "cancelled" && (
            <AdminButton
              variant="danger"
              size="md"
              onClick={() => onCancelClick(order)}
              disabled={isBusy}
            >
              Batalkan
            </AdminButton>
          )}

          {next && (
            <AdminButton
              variant="success"
              size="md"
              onClick={() => onAdvanceStatus(order.id, next)}
              disabled={isBusy}
            >
              {isBusy ? "Menyimpan…" : `Tandai ${STATUS_LABEL[next]}`}
            </AdminButton>
          )}
        </div>
      </div>
    </li>
  );
}
