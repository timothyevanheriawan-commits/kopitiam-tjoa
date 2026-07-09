import type { ValueItem } from "@/lib/about-content";

function ValueIcon({ icon }: { icon: ValueItem["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "h-6 w-6",
  };

  switch (icon) {
    case "scale":
      return (
        <svg {...common}>
          <path d="M12 3v15" />
          <path d="M7 6h10" />
          <path d="M4 7l-2.5 5a2.5 2.5 0 0 0 5 0L4 7z" />
          <path d="M20 7l-2.5 5a2.5 2.5 0 0 0 5 0L20 7z" />
          <path d="M8 21h8" />
        </svg>
      );
    case "lineage":
      return (
        <svg {...common}>
          <circle cx="12" cy="4" r="1.6" />
          <circle cx="6" cy="12" r="1.6" />
          <circle cx="18" cy="12" r="1.6" />
          <circle cx="12" cy="20" r="1.6" />
          <path d="M12 5.6V9" />
          <path d="M9 10.5 12 9l3 1.5" />
          <path d="M6 13.6v3" />
          <path d="M18 13.6v3" />
          <path d="M7.2 18 12 20l4.8-2" />
        </svg>
      );
    case "ledger":
      return (
        <svg {...common}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v3h3" />
          <path d="M9 11h6" />
          <path d="M9 14.5h6" />
          <path d="M9 18h3.5" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-4 4V5z" />
          <path d="M8 9.5h8" />
          <path d="M8 12.5h5" />
        </svg>
      );
    default: {
      // Exhaustiveness guard — if ValueItem["icon"] ever gains a new
      // variant without a matching case here, this fails to COMPILE
      // instead of silently rendering a blank icon slot in production.
      const _exhaustiveCheck: never = icon;
      return _exhaustiveCheck;
    }
  }
}

export function ValuesGrid({ values }: { values: ValueItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
      {values.map((value) => (
        <div
          key={value.key}
          // Changed from border-l-2 (heritage) to border-t-2 (heritage)
          // for two reasons:
          // 1. Left-heritage-border is the sitewide reserved signifier
          //    for .pull-quote — reusing it here diluted that meaning.
          // 2. Top border now matches HighlightList's grammar, so the
          //    About page's two "parallel content block" sections read
          //    as one consistent pattern instead of two unrelated ones.
          className="border-t-2 border-kopi-heritage bg-kopi-bg-raised py-5 px-5 transition-colors duration-200 hover:border-kopi-ink"
        >
          <div className="mb-3 text-kopi-heritage">
            <ValueIcon icon={value.icon} />
          </div>
          <h3 className="mb-1.5 font-display text-lg tracking-tight text-kopi-ink">
            {value.title}
          </h3>
          <p className="font-body text-sm leading-relaxed text-kopi-ink-soft">
            {value.description}
          </p>
        </div>
      ))}
    </div>
  );
}
