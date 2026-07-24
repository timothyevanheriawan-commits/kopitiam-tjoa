export default function MenuLoading() {
  return (
    <main
      id="main-content"
      className="flex-1 bg-kopi-bg pb-24 text-kopi-ink md:pb-32"
    >
      {/* Hero skeleton — static shell only, no pulse. The hero copy is
          always the same regardless of data, so there's nothing to
          simulate loading here; only the board below actually waits
          on a fetch. */}
      <section className="relative overflow-hidden border-b-4 border-double border-kopi-ink bg-linear-to-b from-kopi-bg-raised/50 via-transparent to-transparent pb-12 pt-16 md:pb-20 md:pt-24">
        <span
          aria-hidden="true"
          className="watermark watermark--lg -bottom-8 left-10"
        >
          菜單
        </span>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <p className="mb-3 font-utility text-xs font-bold uppercase tracking-widest text-kopi-signage">
            Sejak 1968
          </p>
          <h1 className="text-emboss font-display text-5xl leading-none tracking-tight text-kopi-heritage-deep md:text-7xl">
            Menu Warisan
          </h1>
        </div>
      </section>

      {/* Board skeleton — same double-border frame and stamp label as
          the real board, so layout doesn't shift on resolve. Category
          headers and rows pulse in place of real content. */}
      <section
        role="status"
        aria-label="Memuat menu"
        className="texture-tile border-b-2 border-kopi-line bg-kopi-bg-raised py-12 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative border-4 border-double border-kopi-ink bg-kopi-bg p-6 shadow-(--shadow-stamp-lg) md:p-10">
            <div className="absolute -top-3.5 left-6 border border-kopi-ink bg-kopi-heritage-deep px-3 py-0.5 font-body text-xs font-bold text-kopi-bg shadow-(--shadow-stamp-sm)">
              Papan Harga Resmi
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col">
                  <div className="mb-6 h-9 w-40 animate-pulse rounded-sm bg-kopi-line/60" />
                  <ul className="flex-1 divide-y divide-kopi-line border-b border-kopi-line">
                    {[0, 1, 2, 3].map((row) => (
                      <li
                        key={row}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <div
                          className="h-4 animate-pulse rounded-sm bg-kopi-line/50"
                          style={{ width: `${55 + ((row * 13) % 30)}%` }}
                        />
                        <div className="h-4 w-12 shrink-0 animate-pulse rounded-sm bg-kopi-line/50" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
