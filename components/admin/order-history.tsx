import type { AdminOrder } from "./admin-types";
import { STATUS_LABEL } from "./admin-display";

export function OrderHistory({
  pastOrders,
  historyLimit,
  onShowMore,
}: {
  pastOrders: AdminOrder[];
  historyLimit: number;
  onShowMore: () => void;
}) {
  if (pastOrders.length === 0) return null;

  return (
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
          onClick={onShowMore}
          className="mt-4 font-utility text-xs uppercase tracking-widest text-kopi-ink-soft underline min-h-11"
        >
          Tampilkan lebih banyak
        </button>
      )}
    </section>
  );
}
