// components/about/generation-illustration.tsx

const PALETTE_STROKE = "var(--kopi-ink)";
const PALETTE_FILL = "var(--kopi-bg-raised)";
const PALETTE_ACCENT = "var(--kopi-heritage)";
const PALETTE_SHADOW = "var(--kopi-line)";

function CartIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label="Ilustrasi rombong kopi kayu tradisi lama 1968"
      className="w-full h-auto max-w-[200px] mx-auto select-none"
    >
      {/* Background ink hatching strokes */}
      <g stroke={PALETTE_SHADOW} strokeWidth="1" strokeLinecap="round">
        <line
          x1="20"
          y1="140"
          x2="180"
          y2="140"
          strokeWidth="2"
          stroke={PALETTE_STROKE}
        />
        <line x1="25" y1="145" x2="45" y2="145" />
        <line x1="65" y1="145" x2="115" y2="145" />
        <line x1="135" y1="145" x2="175" y2="145" />
      </g>

      {/* Main Rombong (Wooden Cart Body) */}
      <rect
        x="45"
        y="65"
        width="110"
        height="55"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Wood Plank Grooves (Woodblock engraving style) */}
      <g stroke={PALETTE_STROKE} strokeWidth="1.5" opacity="0.4">
        <line x1="45" y1="83" x2="155" y2="83" />
        <line x1="45" y1="101" x2="155" y2="101" />
      </g>

      {/* Cart Handle Bar */}
      <path
        d="M30 75 L45 78 M30 75 L30 85"
        stroke={PALETTE_STROKE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Side Shelving Panel */}
      <rect
        x="155"
        y="73"
        width="15"
        height="6"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
      />

      {/* Traditional Tall Tapered Coffee Kettle (Teko Leher Angsa) */}
      <path
        d="M115 65 L120 35 L138 35 L143 65 Z"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Kettle Lid & Handle */}
      <path
        d="M124 35 L124 30 L134 30 L134 35"
        fill="none"
        stroke={PALETTE_STROKE}
        strokeWidth="2"
      />
      <path
        d="M139 42 C149 42 147 58 141 60"
        fill="none"
        stroke={PALETTE_STROKE}
        strokeWidth="2"
      />
      {/* Long Brass Filter Spout */}
      <path
        d="M117 48 C102 44 98 28 106 25"
        fill="none"
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Cloth Filter Ring (Kain Saring) emerging from a pot */}
      <rect
        x="65"
        y="53"
        width="30"
        height="12"
        fill={PALETTE_ACCENT}
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
      />
      <path
        d="M95 59 L110 59"
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M70 65 C72 80 88 80 90 65"
        fill="none"
        stroke={PALETTE_STROKE}
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />

      {/* Solid Spoked Heavy Wheels */}
      <g>
        {/* Left Wheel */}
        <circle
          cx="68"
          cy="132"
          r="20"
          fill={PALETTE_FILL}
          stroke={PALETTE_STROKE}
          strokeWidth="3"
        />
        <circle cx="68" cy="132" r="6" fill={PALETTE_STROKE} />
        <path
          d="M68 112 L68 152 M48 132 L88 132"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />

        {/* Right Wheel */}
        <circle
          cx="132"
          cy="132"
          r="20"
          fill={PALETTE_FILL}
          stroke={PALETTE_STROKE}
          strokeWidth="3"
        />
        <circle cx="132" cy="132" r="6" fill={PALETTE_STROKE} />
        <path
          d="M132 112 L132 152 M112 132 L152 132"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function ShophouseIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label="Ilustrasi meja marmer dan cangkir keramik klasis ruko 1982"
      className="w-full h-auto max-w-[200px] mx-auto select-none"
    >
      {/* Table Surface Backdrop Baseline */}
      <line
        x1="15"
        y1="125"
        x2="185"
        y2="125"
        stroke={PALETTE_STROKE}
        strokeWidth="3"
      />

      {/* Heavy Kopitiam Table Base (Cast Iron Column) */}
      <path
        d="M85 125 L75 160 L125 160 L115 125 Z"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line
        x1="65"
        y1="160"
        x2="135"
        y2="160"
        stroke={PALETTE_STROKE}
        strokeWidth="4"
        strokeLinecap="square"
      />

      {/* Marble Slab Cross-Section Plate */}
      <rect
        x="20"
        y="110"
        width="160"
        height="15"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Marble Veins (Subtle organic line art markings) */}
      <path
        d="M35 116 Q55 122 70 114 M110 120 Q135 113 160 122"
        stroke={PALETTE_SHADOW}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Vintage Metal Coffee Storage Tin Block (Kaleng Kerupuk/Kopi Jadul) */}
      <rect
        x="35"
        y="45"
        width="45"
        height="65"
        fill={PALETTE_FILL}
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Tin Glass Circular Inset window */}
      <circle
        cx="57.5"
        cy="75"
        r="14"
        fill="none"
        stroke={PALETTE_STROKE}
        strokeWidth="2"
      />
      <path d="M48 75 L67 75" stroke={PALETTE_SHADOW} strokeWidth="1.5" />
      {/* Tin Lid Details */}
      <rect
        x="40"
        y="38"
        width="35"
        height="7"
        fill={PALETTE_ACCENT}
        stroke={PALETTE_STROKE}
        strokeWidth="2.5"
      />

      {/* Classic Thick-Walled Porcelain Ceramic Cup & Saucer (Cangkir Lepek Kuno) */}
      <g>
        {/* Deep Rim Saucer */}
        <path
          d="M100 102 C100 111 155 111 155 102 Z"
          fill={PALETTE_FILL}
          stroke={PALETTE_STROKE}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Thick Cup Frame */}
        <path
          d="M106 75 L110 100 C114 104 141 104 145 100 L149 75 Z"
          fill={PALETTE_FILL}
          stroke={PALETTE_STROKE}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Thick Ear Handle */}
        <path
          d="M148 80 C157 80 159 93 147 96"
          fill="none"
          stroke={PALETTE_STROKE}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Traditional Print Ring Motif on Cup Body */}
        <path
          d="M111 86 Q127.5 90 144 86"
          fill="none"
          stroke={PALETTE_ACCENT}
          strokeWidth="2"
        />
      </g>

      {/* Hand-drawn Rising Hot Steam Trails */}
      <g
        stroke={PALETTE_ACCENT}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M120 63 Q116 53 122 45" />
        <path d="M132 65 Q135 55 129 43" />
      </g>
    </svg>
  );
}

function SignageIllustration() {
  return (
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label="Ilustrasi papan nama kayu jati ukir 2008"
      className="w-full h-auto max-w-[200px] mx-auto select-none"
    >
      {/* Hanging Chain Ironwork Mounts */}
      <g
        stroke={PALETTE_STROKE}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M60 20 L60 45" strokeDasharray="1 4" strokeWidth="4" />
        <path d="M140 20 L140 45" strokeDasharray="1 4" strokeWidth="4" />
        <line x1="40" y1="20" x2="160" y2="20" strokeWidth="3" />
      </g>

      {/* Elaborate Dual-Border Solid Wooden Shop Signboard (Plang Ukir Papan Nama) */}
      <g transform="rotate(-1 100 85)">
        {/* Heavy Outer Wood Frame Block */}
        <rect
          x="25"
          y="45"
          width="150"
          height="80"
          fill={PALETTE_FILL}
          stroke={PALETTE_STROKE}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inset Inner Border Line */}
        <rect
          x="32"
          y="52"
          width="136"
          height="66"
          fill="none"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />

        {/* Vintage Wood Corner Accents */}
        <line
          x1="32"
          y1="60"
          x2="40"
          y2="52"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />
        <line
          x1="168"
          y1="60"
          x2="160"
          y2="52"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />
        <line
          x1="32"
          y1="110"
          x2="40"
          y2="118"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />
        <line
          x1="168"
          y1="110"
          x2="160"
          y2="118"
          stroke={PALETTE_STROKE}
          strokeWidth="1.5"
        />

        {/* Central Family Chop / Identity Stamp Mark (蔡記) */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill={PALETTE_ACCENT}
          fontFamily="var(--font-display), serif"
          letterSpacing="2"
        >
          蔡記
        </text>

        {/* Framing Stamp Decorative Dots */}
        <circle cx="50" cy="85" r="3" fill={PALETTE_STROKE} />
        <circle cx="150" cy="85" r="3" fill={PALETTE_STROKE} />

        {/* Bottom Small Text Banner Markings */}
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          fill={PALETTE_STROKE}
          fontFamily="var(--font-body), sans-serif"
          letterSpacing="3"
        >
          EST. 1968
        </text>
      </g>

      {/* Decorative Woodcarving Bracket Shadow Lines at base */}
      <g stroke={PALETTE_SHADOW} strokeWidth="1.5" strokeLinecap="round">
        <line x1="45" y1="140" x2="65" y2="140" />
        <line x1="135" y1="140" x2="155" y2="140" />
      </g>
    </svg>
  );
}

export function GenerationIllustration({
  variant,
}: {
  variant: "cart" | "shophouse" | "signage";
}) {
  if (variant === "cart") return <CartIllustration />;
  if (variant === "shophouse") return <ShophouseIllustration />;
  return <SignageIllustration />;
}
