// New: components/ui/button.tsx — same variants, real <button> element,
// for actions that aren't navigation (e.g. OrderTray's checkout CTA).
import type { ComponentProps } from "react";
import { buttonVariantClasses } from "@/components/ui/button-link";

type Variant = keyof typeof buttonVariantClasses;
type Props = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return <button className={`${buttonVariantClasses[variant]} ${className}`} {...props} />;
}