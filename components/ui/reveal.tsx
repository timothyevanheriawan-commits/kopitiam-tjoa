"use client";

import { useEffect, useRef, useState } from "react";

type RevealVariant =
  | "fade-up"
  | "fade"
  | "slide-left"
  | "slide-right"
  | "scale";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  "fade-up": "",
  fade: "reveal-fade",
  "slide-left": "reveal-slide-left",
  "slide-right": "reveal-slide-right",
  scale: "reveal-scale",
};

/**
 * Scroll-triggered entrance animation. Progressive enhancement by
 * design: if JS fails to hydrate for any reason, content still exists
 * in the DOM (opacity:0 is only ever set via the data-attribute this
 * component controls, not by default CSS) — nothing is ever
 * permanently hidden from a no-JS visitor.
 *
 * variant defaults to "fade-up" (the original, only behavior this
 * component had) — every existing call site keeps working unchanged.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "fade-up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={visible}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
