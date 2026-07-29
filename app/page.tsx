import Link from "next/link";
import { HighlightsStrip } from "@/components/home/highlights-strip";
import { KopiIllustration } from "@/components/home/kopi-illustration";
import { LocationCard } from "@/components/home/location-card";
import { OrderTray } from "@/components/cart/order-tray";
import { getOpenStatus } from "@/lib/hours";
import { getBusinessHours } from "@/lib/business-hours";
import { HeroContent } from "@/components/home/hero-content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

// Assumes lib/hours.ts returns a typed { isOpen: boolean; label: string }
// contract (per the round-1 recommendation). No shape-guessing here —
// if getOpenStatus's return type changes, fix it at the source, not here.

export default async function Home() {
  const { hours, manualOverride } = await getBusinessHours();
  const status = getOpenStatus(hours, manualOverride);
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

          <HeroContent isOpen={isOpen} status={status} />
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-b border-kopi-line bg-kopi-bg-raised py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <HighlightsStrip />
        </div>
      </section>

      {/* NARRATIVE — deliberately breaks the max-w-5xl centered-grid
          pattern every other section uses. Full-bleed heritage band so
          the page has at least one moment of scale/contrast instead of
          every section resolving to the same boxed 2-column shape. */}
      <section className="relative overflow-hidden bg-kopi-heritage-deep py-20 text-kopi-bg md:py-28">
        <span
          aria-hidden="true"
          className="watermark watermark--lg -bottom-16 -left-10"
          style={{ color: "var(--kopi-bg)" }}
        >
          蔡記
        </span>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="mb-3 font-utility text-xs font-bold uppercase tracking-widest text-kopi-bg/70">
              Cerita Rasa Kami
            </p>
            <h2 className="mb-8 font-display text-4xl font-bold tracking-tight text-kopi-bg md:text-5xl">
              Sejak Gerobak Kayu Pertama di Pasar Turi
            </h2>

            <p className="mx-auto mb-8 max-w-xl border-l-3 border-kopi-bg/40 pl-5 text-left font-body text-lg italic leading-relaxed text-kopi-bg/95 md:text-xl">
              Tjoa Kim Hok memulai dari gerobak pinggir Pasar Turi, tiga
              menu saja, dilayani sebelum subuh untuk kuli tekstil yang
              mulai bekerja sebelum matahari terbit.
            </p>

            <p className="mx-auto mb-10 max-w-xl font-body text-base leading-relaxed text-kopi-bg/75 md:text-lg">
              Hampir enam dekade berlalu, resep inti tidak pernah berubah.
              Biji kopi masih dipanggang manual dengan takaran yang sama,
              meja kayu jati asli masih menyambut pelanggan, dan papan nama
              di depan masih hasil lukisan tangan yang sama, hanya
              direstorasi sesekali supaya tetap terbaca.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-kopi-bg underline underline-offset-4 decoration-kopi-bg/40 transition-colors hover:text-kopi-heritage-soft"
            >
              Baca kisah lengkap kami →
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <figure className="mx-auto mt-14 inline-flex flex-col items-center border border-kopi-ink bg-kopi-bg p-4 shadow-(--shadow-stamp-sm)">
              <KopiIllustration />
              <figcaption className="mt-2 font-body text-xs font-semibold uppercase tracking-wider text-kopi-ink-soft">
                Kisah tiga generasi
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* LOCATION — real map, reusing the component already built. */}
      <section className="bg-kopi-bg-raised py-16 md:py-24">
        <Reveal variant="slide-left">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionHeader
                  eyebrow="Kunjungi Kami"
                  title="Lokasi Kampung Lama"
                  className="mb-6"
                />

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
              <Reveal variant="slide-right" delay={150}>
                <LocationCard />
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {isOpen ? <OrderTray /> : null}
    </main>
  );
}
