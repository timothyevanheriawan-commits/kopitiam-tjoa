import type { AdminMenuItem } from "./admin-types";
import { groupByCategory } from "./admin-display";

export function StockList({
  menuItems,
  onToggleStock,
}: {
  menuItems: AdminMenuItem[];
  onToggleStock: (id: string, isAvailable: boolean) => void;
}) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-xl text-kopi-ink tracking-tight mb-4">
        Stok Menu
      </h2>
      <div className="ledger-entry p-5 md:p-6">
        {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
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
                    onClick={() => onToggleStock(item.id, !item.is_available)}
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
        ))}
      </div>
    </section>
  );
}
