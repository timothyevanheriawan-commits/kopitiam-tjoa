import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "accent" | "link";

// Extracted so a future non-link <Button> can consume the identical
// map — CTA styling should never be redefined in a second place.
export const buttonVariantClasses: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 border border-kopi-ink bg-kopi-signage px-8 py-3.5 font-body text-base font-semibold text-kopi-bg transition-colors hover:bg-[var(--kopi-signage-strong)]",
  secondary:
    "inline-flex items-center justify-center gap-2 border border-kopi-ink px-6 py-3 font-body text-sm font-semibold text-kopi-ink transition-colors hover:bg-kopi-ink hover:text-kopi-bg",
  accent:
    "press-button inline-flex items-center justify-center gap-2 border border-kopi-ink bg-kopi-heritage px-6 py-3 font-body text-sm font-semibold text-kopi-bg",
  // Hue-swap on hover is a DELIBERATE exception for inline text links
  // only (signage -> heritage reads as "confirmed/settled," a valid
  // secondary signal for a link, unlike a primary CTA which must never
  // change identity on hover). Scoped and documented, not accidental.
  link: "inline-flex items-center gap-1.5 font-body text-sm font-semibold text-kopi-signage underline underline-offset-4 decoration-kopi-signage/40 transition-colors hover:text-kopi-heritage",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <Link
      className={`${buttonVariantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
