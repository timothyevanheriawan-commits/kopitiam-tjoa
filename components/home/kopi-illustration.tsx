export function KopiIllustration() {
  return (
    <svg
      viewBox="0 0 240 220"
      role="img"
      aria-label="Ilustrasi gelas kopi susu di atas meja marmer"
      className="w-full h-auto max-w-[210px] mx-auto filter drop-shadow-xs"
    >
      {/* Solid woodblock style base surface baseline */}
      <path
        d="M 10 174 L 230 174"
        stroke="var(--kopi-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Traditional Thick Oval Saucer */}
      <ellipse
        cx="120"
        cy="174"
        rx="66"
        ry="14"
        fill="var(--kopi-bg-raised)"
        stroke="var(--kopi-ink)"
        strokeWidth="3"
      />
      <ellipse
        cx="120"
        cy="170"
        rx="54"
        ry="9"
        fill="none"
        stroke="var(--kopi-ink)"
        strokeWidth="1.5"
        opacity="0.4"
      />

      {/* Tapered Faceted Kopitiam Glass Base */}
      <path
        d="M 94 168 L 146 168 L 142 150 L 98 150 Z"
        fill="var(--kopi-bg)"
        stroke="var(--kopi-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Main Glass Tumbler Body */}
      <path
        d="M 98 150 L 88 56 L 152 56 L 142 150 Z"
        fill="var(--kopi-heritage-soft)"
        stroke="var(--kopi-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Kopi Susu fill mass */}
      <path
        d="M 100 146 L 93 78 L 147 78 L 140 146 Z"
        fill="var(--kopi-metal)"
        opacity="0.95"
      />
      <ellipse
        cx="120"
        cy="78"
        rx="26"
        ry="4"
        fill="var(--kopi-bg-raised)"
        opacity="0.25"
      />

      {/* Classical Glass Facet Panel Vertical Partitions */}
      <path
        d="M 103 56 L 107 150"
        stroke="var(--kopi-ink)"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M 112 56 L 114 150"
        stroke="var(--kopi-bg)"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <path
        d="M 120 56 L 120 150"
        stroke="var(--kopi-ink)"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M 128 56 L 126 150"
        stroke="var(--kopi-bg)"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <path
        d="M 137 56 L 133 150"
        stroke="var(--kopi-ink)"
        strokeWidth="2"
        opacity="0.25"
      />

      {/* Rugged Upper Rim Lip */}
      <ellipse
        cx="120"
        cy="56"
        rx="32"
        ry="6"
        fill="none"
        stroke="var(--kopi-ink)"
        strokeWidth="3"
      />

      {/* Loose, wavy hand-inked steam wisps */}
      <path
        d="M 112 42 Q 104 28 114 18 T 108 4"
        stroke="var(--kopi-heritage)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 128 42 Q 136 30 126 20 T 130 6"
        stroke="var(--kopi-heritage)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
