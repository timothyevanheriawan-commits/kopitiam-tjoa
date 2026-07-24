import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden bg-kopi-bg px-6 py-24 text-kopi-ink"
    >
      <span aria-hidden="true" className="watermark -bottom-10 -right-6">
        迷路
      </span>

      <div className="relative z-10 mx-auto max-w-lg text-center">
        <p className="mb-4 font-utility text-xs font-bold uppercase tracking-widest text-kopi-signage">
          Halaman Tidak Ditemukan
        </p>

        <div className="stamp-in mx-auto mb-6 inline-flex -rotate-3 items-center justify-center border-4 border-double border-kopi-ink bg-kopi-bg px-8 py-6 shadow-(--shadow-stamp-md)">
          <span className="font-display text-6xl font-black leading-none tracking-tight text-kopi-heritage-deep md:text-7xl">
            404
          </span>
        </div>

        <h1 className="mb-3 font-display text-2xl tracking-tight text-kopi-ink md:text-3xl">
          Meja Ini Kosong
        </h1>

        <p className="mx-auto mb-8 max-w-sm font-body text-sm leading-relaxed text-kopi-ink-soft md:text-base">
          Halaman yang Anda cari sudah dipindahkan atau tidak pernah ada di menu
          kami. Mari kembali ke meja utama.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="primary">
            Kembali ke Beranda
          </ButtonLink>
          <ButtonLink href="/menu" variant="secondary">
            Lihat Menu
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
