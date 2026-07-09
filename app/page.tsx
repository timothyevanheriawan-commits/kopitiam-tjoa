import Link from "next/link";
import { Signboard } from "@/components/home/signboard";
import { OpenBadge } from "@/components/home/open-badge";
import { HighlightsStrip } from "@/components/home/highlights-strip";
import { KopiIllustration } from "@/components/home/kopi-illustration";
import { LocationCard } from "@/components/home/location-card";
import { OrderTray } from "@/components/cart/order-tray";
import { getOpenStatus } from "@/lib/hours";
import { DEFAULT_HOURS } from "@/lib/constants";

// Assumes lib/hours.ts returns a typed { isOpen: boolean; label: string }
// contract (per the round-1 recommendation). No shape-guessing here —
// if getOpenStatus's return type changes, fix it at the source, not here.

export default function Home() {
  const status = getOpenStatus(DEFAULT_HOURS, null);
  const isOpen = status.isOpen;

  return (
    <main
      id="main-content"
      className="flex-1 bg-kopi-bg text-kopi-ink selection:bg-kopi-signage selection:text-kopi-bg"
    >
      {/* HERO — one headline, one supporting line, one action. */}
      <section className="texture-tile relative overflow-hidden border-b border-kopi-line py-16 md:py-24">
        <div className="relative mx-auto max-w-5xl px-6">
          <span aria-hidden="true" className="watermark right-6 top-0">
            蔡記
          </span>

          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-center">
            <div className="flex flex-col items-start gap-8">
              <Signboard />

              <p className="max-w-xl font-body text-lg text-kopi-ink-soft md:text-xl">
                Resep yang sama sejak gerobak pertama di Pasar Turi, terjaga
                utuh sejak 1968.
              </p>

              <div className="flex flex-col items-start gap-3">
                <Link
                  href="/menu"
                  className="stamp-button border-2 border-kopi-ink bg-kopi-signage px-8 py-3.5 font-utility text-sm font-bold uppercase tracking-widest text-kopi-bg"
                >
                  {isOpen ? "Pesan Kopi Sekarang" : "Lihat Menu Sajian"}
                </Link>

                {!isOpen && (
                  <p className="max-w-sm font-body text-sm text-kopi-ink-soft">
                    Kedai sedang tutup. Menu tetap bisa dilihat, pemesanan akan
                    aktif kembali saat kami buka.
                  </p>
                )}
              </div>
            </div>

            {/* Flat callout, same motif as the menu page's rail card — the
          hero's one supporting anchor, not a second decorative device. */}
            <div className="border border-kopi-line bg-kopi-bg p-6">
              <OpenBadge status={status} />
              <p className="mt-4 font-body text-sm leading-relaxed text-kopi-ink-soft">
                Senin–Jumat 05.00–15.00
                <br />
                Sabtu 05.00–13.00
                <br />
                Minggu tutup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-b border-kopi-line bg-kopi-bg-raised py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <HighlightsStrip />
        </div>
      </section>

      {/* NARRATIVE */}
      <section className="border-b border-kopi-line py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <figure className="border border-kopi-line bg-kopi-bg-raised p-2">
              <div className="flex items-center justify-center bg-kopi-bg p-8">
                <KopiIllustration />
              </div>
              <figcaption className="mt-2 px-2 pb-2 font-body text-xs font-semibold uppercase tracking-wider text-kopi-ink-soft">
                Kisah tiga generasi
              </figcaption>
            </figure>

            <div>
              <p className="mb-2 font-body text-xs font-bold uppercase tracking-widest text-kopi-heritage">
                Cerita Rasa Kami
              </p>
              <h2 className="mb-6 font-display text-3xl font-bold tracking-tight text-kopi-ink md:text-4xl">
                Sejak Gerobak Kayu Pertama di Pasar Turi
              </h2>

              <p className="pull-quote mb-6">
                Tjoa Kim Hok memulai dari gerobak pinggir Pasar Turi, tiga menu
                saja, dilayani sebelum subuh untuk kuli tekstil yang mulai
                bekerja sebelum matahari terbit.
              </p>

              <p className="font-body text-base leading-relaxed text-kopi-ink-soft md:text-lg">
                Hampir enam dekade berlalu, resep inti tidak pernah berubah.
                Biji kopi masih dipanggang manual dengan takaran yang sama, meja
                kayu jati asli masih menyambut pelanggan, dan papan nama di
                depan masih hasil lukisan tangan yang sama, hanya direstorasi
                sesekali supaya tetap terbaca.
              </p>

              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-kopi-signage underline underline-offset-4 decoration-kopi-signage/40 transition-colors hover:text-kopi-heritage"
              >
                Baca kisah lengkap kami →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION — real map, reusing the component already built. */}
      <section className="bg-kopi-bg-raised py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-2 font-body text-xs font-bold uppercase tracking-widest text-kopi-signage">
                Kunjungi Kami
              </p>
              <h2 className="mb-6 font-display text-3xl tracking-tight text-kopi-heritage md:text-4xl">
                Lokasi Kampung Lama
              </h2>

              <div className="border-l-4 border-kopi-line pl-5">
                <p className="font-body text-lg font-semibold text-kopi-ink">
                  Jl. Kembang Jepun, Surabaya
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-kopi-ink-soft md:text-base">
                  Tepat di kawasan niaga tekstil lama, mudah ditemukan dan ada
                  tempat parkir persis di depan kedai.
                </p>
              </div>
              <a
                href="tel:+62315551968"
                className="mt-4 inline-block font-utility text-xs tracking-wider text-kopi-ink-soft transition-colors hover:text-kopi-signage"
              >
                Telepon Kedai: (031) 555-1968
              </a>
            </div>

            <LocationCard />
          </div>
        </div>
      </section>

      {isOpen ? <OrderTray /> : null}
    </main>
  );
}
