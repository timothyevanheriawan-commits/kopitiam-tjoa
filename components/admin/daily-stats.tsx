import { formatIDR } from "./admin-display";

export function DailyStats({
  orderCount,
  revenue,
  isLoading,
}: {
  orderCount: number | null;
  revenue: number | null;
  isLoading: boolean;
}) {
  return (
    <section className="mb-10 grid grid-cols-2 gap-4">
      <div className="ledger-entry p-5">
        <p className="font-utility text-xs uppercase tracking-widest text-kopi-ink-soft mb-1">
          Pesanan Hari Ini
        </p>
        <p className="font-display text-2xl text-kopi-ink tabular-nums">
          {isLoading || orderCount === null ? "—" : orderCount}
        </p>
      </div>
      <div className="ledger-entry p-5">
        <p className="font-utility text-xs uppercase tracking-widest text-kopi-ink-soft mb-1">
          Pendapatan Hari Ini
        </p>
        <p className="font-display text-2xl text-kopi-ink tabular-nums">
          {isLoading || revenue === null ? "—" : formatIDR(revenue)}
        </p>
      </div>
    </section>
  );
}
