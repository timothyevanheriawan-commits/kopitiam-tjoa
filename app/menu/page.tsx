// app/menu/page.tsx
import { MenuBoard } from "@/components/menu/menu-board";
import { OrderTray } from "@/components/cart/order-tray";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const CASHIER_CONTACT_HREF = "https://wa.me/62REPLACE_WITH_REAL_NUMBER";

export default function MenuPage() {
  return (
    <main
      id="main-content"
      className="flex-1 bg-kopi-bg pb-24 text-kopi-ink selection:bg-kopi-signage selection:text-kopi-bg md:pb-32"
    >
      {/* 1. HERO — double-rule bottom border (echoes the menu board's own
          double frame below, a deliberate visual rhyme), subtle depth
          gradient, and embossed headline for print-shop weight instead
          of flat borderline-contrast color alone. */}
      <section className="relative overflow-hidden border-b-4 border-double border-kopi-ink bg-linear-to-b from-kopi-bg-raised/50 via-transparent to-transparent pb-12 pt-16 md:pb-20 md:pt-24">
        <span
          aria-hidden="true"
          className="watermark watermark--lg -bottom-8 left-10"
        >
          菜單
        </span>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1fr_var(--menu-rail-width)]">
            <Reveal>
              <p className="mb-3 font-utility text-xs font-bold uppercase tracking-widest text-kopi-signage">
                Sejak 1968
              </p>
              <h1 className="text-emboss font-display text-5xl leading-none tracking-tight text-kopi-heritage-deep md:text-7xl">
                Menu Warisan
              </h1>

              {/* Pull-quote now sits in a soft card, not floating
                  directly on the page background — resolves the
                  "washed out" complaint by giving it its own contrast
                  plane instead of competing with the hero gradient. */}
              <div className="mt-6 max-w-xl border-l-4 border-kopi-heritage-deep bg-kopi-bg-raised/60 p-5">
                <p className="font-body text-lg italic leading-relaxed text-kopi-ink-soft md:text-xl">
                  Resep yang sama dari gerobak Pasar Turi sampai hari ini,
                  diseduh langsung di depan Anda dengan takaran yang tidak
                  pernah diubah sejak generasi pertama.
                </p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="hidden border border-kopi-line bg-kopi-bg p-5 shadow-(--shadow-stamp-sm) lg:block">
                <p className="mb-1 font-body text-xs font-bold tracking-wide text-kopi-heritage-deep">
                  Tradisi Seduh Kedai
                </p>
                <p className="font-body text-xs leading-relaxed text-kopi-ink-soft">
                  Manis dan pekatnya mengikuti resep asli ruko Pasar Turi,
                  begitu juga takaran esnya, supaya rasa klasik itu tidak pernah
                  berubah.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. THE BOARD */}
      <section className="texture-tile border-b-2 border-kopi-line bg-kopi-bg-raised py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_var(--menu-rail-width)]">
            <Reveal className="relative">
              <div className="relative border-4 border-double border-kopi-ink bg-kopi-bg p-6 shadow-(--shadow-stamp-lg) md:p-10">
                <div className="stamp-in absolute -top-3.5 left-6 border border-kopi-ink bg-kopi-heritage-deep px-3 py-0.5 font-body text-xs font-bold text-kopi-bg shadow-(--shadow-stamp-sm)">
                  Papan Harga Resmi
                </div>

                <MenuBoard />
              </div>
            </Reveal>

            <aside className="space-y-6 lg:pt-4">
              {/* Info blocks now have their own card plane instead of
                  floating directly on the busy texture-tile background —
                  this is the direct fix for low perceived contrast in
                  this section. No hover state added: these are static
                  informational cards, not interactive controls, and
                  giving them a hover reaction would imply an affordance
                  that doesn't exist. */}
              <Reveal delay={100}>
                <div className="space-y-5 border-t border-kopi-line pt-5">
                  <div>
                    <p className="font-body text-xs font-bold tracking-wide text-kopi-ink-soft">
                      Biji Kopi Pilihan
                    </p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-kopi-ink-soft">
                      Kami memilih biji Robusta Dampit yang disangrai gelap di
                      atas bara kayu, menghasilkan aroma arang yang kuat dan
                      rasa pekat di setiap tegukan.
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-xs font-bold tracking-wide text-kopi-ink-soft">
                      Metode Tarik Kain
                    </p>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-kopi-ink-soft">
                      Disaring berkali-kali dengan kain flanel tradisional, cara
                      lama yang menjaga rasa tetap kental dan bulat, persis
                      seperti puluhan tahun lalu.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="border-l-4 border-kopi-ink bg-kopi-signage p-5 text-kopi-bg shadow-(--shadow-stamp-sm)">
                  <p className="mb-1 font-body text-xs font-bold text-kopi-bg">
                    Catatan Kasir
                  </p>
                  <p className="font-display text-lg leading-tight text-kopi-bg">
                    Semua harga yang tertera sudah bersih, tanpa biaya tambahan
                    apa pun.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. BULK ORDER NOTICE — dashed border strengthened for visibility
          (border-kopi-line was reading too faint against the raised
          background), hover interaction added ONLY to the actual button
          inside it, not the static card wrapper. */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6 border-2 border-dashed border-kopi-ink/35 bg-kopi-bg-raised p-6 shadow-(--shadow-stamp-sm) lg:flex-nowrap">
              <div className="flex items-center gap-4">
                <div className="hidden h-10 w-1 shrink-0 bg-kopi-heritage-deep sm:block" />
                <div>
                  <p className="font-body text-base font-bold text-kopi-ink">
                    Butuh pesanan dalam jumlah besar, untuk acara atau usaha
                    Anda?
                  </p>
                  <p className="mt-0.5 font-body text-sm text-kopi-ink-soft">
                    Kami antar langsung memakai rantang susun atau wadah
                    tertutup, sampai ke tempat Anda.
                  </p>
                </div>
              </div>

              <ButtonLink
                href={CASHIER_CONTACT_HREF}
                target="_blank"
                variant="accent"
                className="whitespace-nowrap"
              >
                Chat ke Meja Kasir
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <OrderTray />
    </main>
  );
}
