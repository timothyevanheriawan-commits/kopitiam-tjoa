// components/admin/admin-button.tsx
import type { ComponentProps } from "react";

type Variant = "primary" | "success" | "danger" | "neutral" | "ghost";
type Size = "sm" | "md";

/**
 * The ONE button system for every admin surface: login, order actions,
 * stock toggles, filters, logout. Every variant shares the identical
 * typography, border weight, sizing scale, and tactile press shadow —
 * they differ ONLY in color, which maps to a fixed semantic meaning:
 *
 *   primary  — the main forward action on a screen (login "Masuk").
 *              Signage red, matches the sitewide primary-CTA convention.
 *   success  — positive progression (advance an order's status).
 *              Filled heritage green — deliberately NOT signage red,
 *              which is reserved for urgent/destructive/error states.
 *   danger   — destructive, pre-confirmation (Cancel). Outlined, not
 *              filled — full red fill only appears on the actual
 *              confirm step inside ConfirmDialog, never here.
 *   neutral  — secondary utility action with real visual weight (Print).
 *   ghost    — lowest-weight utility action (Logout, Refresh). No
 *              border, no shadow — intentionally the one exception,
 *              reserved for actions that should never compete visually
 *              with the primary/success/danger actions on the same screen.
 *
 * All variants except ghost reuse .press-button's tactile shadow
 * mechanic so every "real" action feels equally intentional and
 * physically consistent, regardless of its color.
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "press-button border border-kopi-ink bg-kopi-signage text-kopi-bg hover:bg-[var(--kopi-signage-strong)]",
  success:
    "press-button border border-kopi-ink bg-kopi-heritage text-kopi-bg hover:bg-[var(--kopi-heritage-strong)]",
  danger:
    "press-button border border-kopi-signage bg-kopi-bg text-kopi-signage hover:bg-kopi-signage hover:text-kopi-bg",
  neutral:
    "press-button border border-kopi-line bg-kopi-bg text-kopi-ink-soft hover:border-kopi-ink hover:text-kopi-ink",
  ghost:
    "border-none bg-transparent text-kopi-ink-soft underline underline-offset-4 decoration-kopi-ink-soft/40 hover:text-kopi-ink hover:decoration-kopi-ink",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "min-h-10 px-3 text-[11px]",
  md: "min-h-11 px-5 text-xs",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-utility font-bold uppercase tracking-widest transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none";

type Props = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function AdminButton({
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`${BASE} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
