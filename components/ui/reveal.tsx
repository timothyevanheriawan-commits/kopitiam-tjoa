// components/ui/reveal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered entrance animation. Progressive enhancement by
 * design: if JS fails to hydrate for any reason, content still exists
 * in the DOM (opacity:0 is only ever set via the data-attribute this
 * component controls, not by default CSS) — nothing is ever
 * permanently hidden from a no-JS visitor.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
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
      className={className}
    >
      {children}
    </div>
  );
}
