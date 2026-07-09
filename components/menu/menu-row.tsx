"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { TAG_LABEL, type MenuTag } from "@/lib/tags";
import type { MenuItem } from "@/types/domain";

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getDisplayTag(item: MenuItem): MenuTag | null {
  if (item.tags.includes("signature")) return "signature";
  if (item.tags.includes("best_seller")) return "best_seller";
  return null;
}

export function MenuRow({ item }: { item: MenuItem }) {
  const isSoldOut = !item.is_available;
  const displayTag = getDisplayTag(item);
  const addItem = useCartStore((state) => state.addItem);

  const groups = item.variant_options ?? [];
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      groups.map((group) => [group.name, group.options[0]?.label ?? ""]),
    ),
  );
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    const variantLabel =
      groups.length > 0
        ? groups
            .map((g) => selected[g.name])
            .filter(Boolean)
            .join(" / ")
        : null;

    addItem({
      menuItemId: item.id,
      name: item.name,
      unitPrice: item.price,
      selectedVariant: variantLabel,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const mutedText = isSoldOut ? "text-kopi-ink-soft" : "text-kopi-ink";

  return (
    <li className="relative py-4">
      <div className="flex items-baseline justify-between gap-4 font-body text-base md:text-lg">
        <span
          className={`flex flex-wrap items-center gap-2 font-bold tracking-tight ${mutedText}`}
        >
          {item.name}
          {displayTag && !isSoldOut && (
            <span className="tag-pill">{TAG_LABEL[displayTag]}</span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="mx-2 flex-1 self-center border-b border-dotted border-kopi-line"
        />

        <span
          className={`whitespace-nowrap font-bold ${isSoldOut ? "text-kopi-ink-soft line-through" : "text-kopi-ink"}`}
        >
          {formatIDR(item.price)}
        </span>
      </div>

      {item.description && (
        <p className="mt-1 max-w-xl font-body text-sm leading-relaxed text-kopi-ink-soft">
          {item.description}
        </p>
      )}

      {!isSoldOut && groups.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {groups.map((group) => (
            <div key={group.name} className="flex items-center gap-1.5">
              <span className="font-body text-xs text-kopi-ink-soft">
                {group.name}:
              </span>
              <div className="flex gap-1">
                {group.options.map((option) => {
                  const active = selected[group.name] === option.label;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() =>
                        setSelected((prev) => ({
                          ...prev,
                          [group.name]: option.label,
                        }))
                      }
                      aria-pressed={active}
                      className={`border px-2 py-0.5 font-body text-xs transition-colors ${
                        active
                          ? "border-kopi-heritage bg-kopi-heritage-soft font-semibold text-kopi-heritage"
                          : "border-kopi-line text-kopi-ink-soft hover:border-kopi-heritage"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSoldOut && (
        <button
          type="button"
          onClick={handleAdd}
          disabled={justAdded}
          aria-live="polite"
          className="mt-3 border border-kopi-ink px-3 py-1.5 font-body text-xs font-bold text-kopi-ink transition-colors hover:bg-kopi-ink hover:text-kopi-bg disabled:cursor-default disabled:border-kopi-heritage disabled:text-kopi-heritage disabled:hover:bg-transparent"
        >
          {justAdded ? "Ditambahkan" : "Tambah ke Pesanan"}
        </button>
      )}

      {isSoldOut && (
        <div className="stamp-habis">
          <span>Habis</span>
        </div>
      )}
    </li>
  );
}
