import type { OrderStatus } from "@/types/domain";
import { AdminButton } from "@/components/admin/admin-button";
import { FILTERS } from "./admin-display";

export function OrderFilters({
  value,
  onChange,
}: {
  value: OrderStatus | "all";
  onChange: (value: OrderStatus | "all") => void;
}) {
  return (
    // Filter chips — Hick's Law: let staff narrow the visible set on
    // demand instead of always scanning everything.
    <div className="flex gap-1.5" role="tablist" aria-label="Filter status pesanan">
      {FILTERS.map((f) => (
        <AdminButton
          key={f.value}
          variant={value === f.value ? "neutral" : "ghost"}
          size="sm"
          role="tab"
          aria-selected={value === f.value}
          onClick={() => onChange(f.value)}
          className={value === f.value ? "text-kopi-ink! border-kopi-ink!" : ""}
        >
          {f.label}
        </AdminButton>
      ))}
    </div>
  );
}
