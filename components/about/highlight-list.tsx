import type { HighlightItem } from "@/lib/about-content";

export function HighlightList({ items }: { items: HighlightItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
      {items.map((item, i) => (
        <div key={item.key} className="border-t-2 border-kopi-line pt-4">
          <span className="index-tag">0{i + 1}</span>
          <h3 className="mb-2 font-display text-base tracking-tight text-kopi-heritage md:text-lg">
            {item.title}
          </h3>
          <p className="font-body text-sm leading-relaxed text-kopi-ink-soft">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
