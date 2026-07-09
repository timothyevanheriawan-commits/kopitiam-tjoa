"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Cerita Kami" },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-kopi-line bg-kopi-bg-raised/45 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 h-16 md:h-18 flex items-center justify-between">
        <Logo className="h-12 w-auto" />

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-8"
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
                <span
                  className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-kopi-signage transition-transform ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
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

      <nav
        id="mobile-nav"
        aria-label="Navigasi mobile"
        className={`grid overflow-hidden border-t border-kopi-line transition-[grid-template-rows] duration-200 md:hidden ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 font-body text-sm font-semibold text-kopi-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/menu"
                onClick={() => setIsOpen(false)}
                className="block bg-kopi-ink px-4 py-2.5 text-center font-body text-sm font-bold text-kopi-bg"
              >
                Pesan Sekarang
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
