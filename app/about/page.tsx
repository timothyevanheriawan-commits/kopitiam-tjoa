import Link from "next/link";
import {
  GENERATIONS,
  VALUES,
  PROCESS_STEPS,
  HIGHLIGHTS,
} from "@/lib/about-content";
import { GenerationRow } from "@/components/about/generation-row";
import { ValuesGrid } from "@/components/about/values-grid";
import { ProcessSteps } from "@/components/about/process-steps";
import { HighlightList } from "@/components/about/highlight-list";
import { SectionHeader } from "@/components/ui/section-header";

export default function AboutPage() {
  return (
    <main
      id="main-content"
      className="flex-1 bg-kopi-bg text-kopi-ink selection:bg-kopi-signage selection:text-kopi-bg"
    >
      {/* 1. HERO */}
      <section className="border-b-2 border-kopi-ink pb-12 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl">
            <p className="mb-3 font-utility text-xs font-bold uppercase tracking-widest text-kopi-signage">
              Kronologi Dokumen
            </p>
            <h1 className="mb-5 font-display text-5xl leading-none tracking-tight text-kopi-heritage md:text-7xl">
              Cerita Kami
            </h1>
            <p className="mb-6 max-w-xl font-body text-lg leading-relaxed text-kopi-ink-soft md:text-xl">
              Kopitiam keluarga Tjoa (蔡記) menjaga rasa yang sama sejak gerobak
              pertama berdiri di Pasar Turi tahun 1968, kini diteruskan generasi
              ketiga di Jalan Kembang Jepun, Surabaya.
            </p>
            <p className="pull-quote max-w-xl">
              Tiga generasi, satu resep yang tidak berubah.
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHY */}
      <section className="relative overflow-hidden border-b-2 border-kopi-line py-16 md:py-24">
        <span aria-hidden="true" className="watermark right-0 top-0">
          EST. 1968
        </span>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <p className="mb-4 font-utility text-xs font-bold uppercase tracking-widest text-kopi-ink-soft">
            Mengapa Kopitiam Ini Ada
          </p>
          <div className="max-w-2xl space-y-5">
            <p className="font-body text-base leading-relaxed text-kopi-ink-soft md:text-lg">
              Kopitiam ini tidak pernah dirancang untuk jadi besar. Ia dimulai
              dari kebutuhan sederhana: kopi yang cukup panas dan roti yang
              cukup mengenyangkan untuk kuli tekstil yang mulai bekerja sebelum
              matahari terbit. Filosofi itu tidak pernah berubah, meski meja,
              ruko, dan generasi yang menjaga sudah berganti tiga kali.
            </p>
            <p className="font-body text-base leading-relaxed text-kopi-ink-soft md:text-lg">
              Yang dipegang teguh justru sebaliknya dari tren: bukan menu yang
              terus bertambah, tapi menu yang cukup dan konsisten. Setiap
              perubahan yang diterima, dari meja marmer bekas hingga alur
              pemesanan lewat WhatsApp, selalu diuji dengan satu pertanyaan
              sederhana: apakah ini membuat kopi yang sama lebih mudah
              dinikmati, atau hanya menambah rumit.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GENERATION LOG — the one texture-tile section on this page */}
      <section className="texture-tile border-b-2 border-kopi-line bg-kopi-bg-raised py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-16 md:space-y-24">
            {GENERATIONS.map((entry, i) => (
              <GenerationRow key={entry.key} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUES — informational, not tied to ordering: ink heading */}
      <section className="border-b-2 border-kopi-line py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeader
            eyebrow="Yang Kami Pegang"
            title="Empat Hal yang Tidak Kami Tawar"
            titleClassName="text-kopi-ink"
            className="mb-10 max-w-2xl md:mb-14"
          />
          <ValuesGrid values={VALUES} />
        </div>
      </section>

      {/* 5. PROCESS — tied to the ordering flow: heritage heading */}
      <section className="border-b-2 border-kopi-line bg-kopi-bg-raised py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-16">
          <SectionHeader
            eyebrow="Cara Memesan"
            eyebrowClassName="text-kopi-ink-soft"
            title="Tiga Langkah, Tanpa Aplikasi Tambahan"
            className="lg:col-span-4"
          />
          <div className="lg:col-span-8">
            <ProcessSteps steps={PROCESS_STEPS} />
          </div>
        </div>
      </section>

      {/* 6. HIGHLIGHTS — informational: ink heading */}
      <section className="border-b-2 border-kopi-line py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeader
            eyebrow="Yang Membedakan"
            title="Bukan Sekadar Rasa yang Sama"
            titleClassName="text-kopi-ink"
            className="mb-10 max-w-2xl md:mb-14"
          />
          <HighlightList items={HIGHLIGHTS} />
        </div>
      </section>

      {/* 7. CLOSING CTA — the page's one conversion moment, gets extra
          breathing room (py-20/28) vs. the standard py-16/24 rhythm. */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl border border-kopi-line p-8 text-center md:p-12">
            <h2 className="mb-4 font-display text-2xl tracking-tight text-kopi-heritage md:text-3xl">
              Sudah Kenal Ceritanya
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-body text-base leading-relaxed text-kopi-ink-soft md:text-lg">
              Waktunya coba kopi yang sama dengan yang diminum tiga generasi
              sebelumnya. Menu lengkap dan cara pesan ada satu klik dari sini.
            </p>

            {/* .stamp-button owns rotation + hover state entirely — no
                extra Tailwind transform utilities added here. */}
            <Link
              href="/menu"
              className="stamp-button border-2 border-kopi-ink bg-kopi-signage px-8 py-3.5 font-utility text-sm font-bold uppercase tracking-widest text-kopi-bg"
            >
              Lihat Menu &amp; Pesan
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-kopi-line pt-6 text-sm">
              <span className="font-body text-kopi-ink-soft">
                Jl. Kembang Jepun, Surabaya
              </span>
              <span className="border border-kopi-line bg-kopi-bg-raised px-3 py-1 font-utility text-xs font-bold tracking-tight text-kopi-heritage">
                Kawasan Niaga Tekstil Lama
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
