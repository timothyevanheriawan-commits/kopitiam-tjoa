import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";

const SIZES = {
  sm: { icon: "h-8 w-8", title: "text-sm", tagline: null },
  md: { icon: "h-9 w-9", title: "text-base md:text-lg", tagline: "text-[9px]" },
  lg: {
    icon: "h-12 w-12",
    title: "text-xl md:text-2xl",
    tagline: "text-[10px]",
  },
} as const;

export function Logo({
  withWordmark = true,
  size = "md",
  className = "",
}: {
  withWordmark?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <Link
      href="/"
      aria-label="Kopitiam Tjoa, kembali ke halaman utama"
      className={[
        "flex min-h-11 shrink-0 items-center gap-2.5",
        className,
      ].join(" ")}
    >
      <BrandMark className={`${s.icon} shrink-0`} />

      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display ${s.title} text-kopi-ink tracking-tight`}
          >
            Kopitiam Tjoa
          </span>
          {s.tagline && (
            <span
              className={`font-utility ${s.tagline} tracking-[0.2em] text-kopi-ink-soft uppercase mt-0.5`}
            >
              Est. 1968
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
