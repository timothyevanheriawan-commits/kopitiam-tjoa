"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Signboard } from "@/components/home/signboard";
import { OpenBadge } from "@/components/home/open-badge";
import { fadeUp, staggerContainer, springTransition } from "@/lib/motion";
import type { OpenStatus } from "@/lib/hours";

export function HeroContent({
  isOpen,
  status,
}: {
  isOpen: boolean;
  status: OpenStatus;
}) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : springTransition;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.15)}
        className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left"
      >
        <motion.div variants={fadeUp} transition={transition}>
          <Signboard />
        </motion.div>

        <motion.p
          variants={fadeUp}
          transition={transition}
          className="mx-auto max-w-xl font-body text-lg text-kopi-ink-soft md:text-xl lg:mx-0"
        >
          Resep yang sama sejak gerobak pertama di Pasar Turi, terjaga utuh
          sejak 1968.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={transition}
          className="flex flex-col items-center gap-3 lg:items-start"
        >
          <Link
            href="/menu"
            className="stamp-button border-2 border-kopi-ink bg-kopi-signage px-8 py-3.5 font-utility text-sm font-bold uppercase tracking-widest text-kopi-bg"
          >
            {isOpen ? "Pesan Kopi Sekarang" : "Lihat Menu Sajian"}
          </Link>

          {!isOpen && (
            <p className="mx-auto max-w-sm font-body text-sm text-kopi-ink-soft lg:mx-0">
              Kedai sedang tutup. Menu tetap bisa dilihat, pemesanan akan aktif
              kembali saat kami buka.
            </p>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.5 }}
        className="border border-kopi-line bg-kopi-bg p-6"
      >
        <OpenBadge status={status} />
        <p className="mt-4 font-body text-sm leading-relaxed text-kopi-ink-soft">
          Senin–Jumat 05.00–15.00
          <br />
          Sabtu 05.00–13.00
          <br />
          Minggu tutup
        </p>
      </motion.div>
    </div>
  );
}
