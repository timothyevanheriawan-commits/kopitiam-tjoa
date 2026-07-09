"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/layout/logo";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Cerita Kami" },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically on route change — prevents a
  // stale open menu from persisting after tapping a link that scrolls
  // to the same page (edge case the previous version didn't guard).
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-kopi-bg-raised/45 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-kopi-ink/40 shadow-[0_2px_0_0_var(--kopi-line)]"
          : "border-kopi-line"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 md:h-18">
        <Logo className="h-12 w-auto" />

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="relative py-2 font-body text-sm font-semibold tracking-wide text-kopi-ink-soft transition-colors hover:text-kopi-ink"
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-px left-0 h-[2px] w-full bg-kopi-signage"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/menu"
            className="bg-kopi-ink px-4 py-2 font-body text-sm font-bold text-kopi-bg transition-colors hover:bg-kopi-heritage"
          >
            Pesan Sekarang
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="relative flex h-9 w-9 items-center justify-center md:hidden"
        >
          <span
            className={`absolute h-[1.5px] w-5 bg-kopi-ink transition-transform duration-200 ${
              isOpen ? "rotate-45" : "translate-y-[-5px]"
            }`}
          />
          <span
            className={`absolute h-[1.5px] w-5 bg-kopi-ink transition-transform duration-200 ${
              isOpen ? "-rotate-45" : "translate-y-[5px]"
            }`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Navigasi mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.25,
              ease: "easeInOut",
            }}
            className="overflow-hidden border-t border-kopi-line md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.06,
                  },
                },
              }}
              className="flex flex-col gap-1 px-6 py-4"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 font-body text-sm font-semibold text-kopi-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                className="pt-2"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href="/menu"
                  onClick={() => setIsOpen(false)}
                  className="block bg-kopi-ink px-4 py-2.5 text-center font-body text-sm font-bold text-kopi-bg"
                >
                  Pesan Sekarang
                </Link>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
