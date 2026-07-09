// components/home/highlights-strip.tsx

const FEATURED = {
  name: "Set Klasik",
  note: "Menu yang sama dipesan kuli tekstil Pasar Turi sebelum subuh, sejak 1968.",
  price: 28000,
  tag: "Sejak 1968",
};

const SECONDARY = [
  {
    name: "Kopi Susu Tjoa",
    note: "Rasio pekat-manis yang tidak berubah sejak resep pertama.",
    price: 12000,
    tag: "Sejak 1968",
  },
  {
    name: "Roti Bakar Srikaya",
    note: "Dipanggang di atas arang, selai srikaya dibuat setiap pagi.",
    price: 12000,
    tag: "Paling Laris",
  },
];

function formatIDR(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function TagPill({ label }: { label: string }) {
  return <span className="tag-pill">{label}</span>;
}

export function HighlightsStrip() {
  return (
    <section aria-labelledby="highlights-heading" className="py-4">
      <div className="mb-8 flex items-baseline gap-4">
        <h2
          id="highlights-heading"
          className="font-display text-2xl tracking-tight text-kopi-heritage md:text-3xl"
        >
          Tiga Menu yang Paling Dicari
        </h2>
        <div className="h-px flex-1 bg-kopi-line" />
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        {/* Featured — no hard shadow: the Signboard already owns this
            page's one shadow-anchor. This card stands out via a
            slightly stronger border + background tint instead. */}
        <div className="relative flex flex-col gap-3 border-2 border-kopi-ink bg-kopi-bg p-6 lg:col-span-7">
          <div className="absolute right-5 top-5">
            <TagPill label={FEATURED.tag} />
          </div>

          <p className="font-utility text-xs font-bold tracking-widest text-kopi-ink-soft">
            DIPESAN SEBELUM SUBUH
          </p>

          <h3 className="max-w-[70%] font-display text-2xl font-bold leading-tight text-kopi-ink md:text-3xl">
            {FEATURED.name}
          </h3>

          <p className="mt-1 font-body text-base leading-relaxed text-kopi-ink-soft">
            {FEATURED.note}
          </p>

          <div className="mt-4 flex items-baseline justify-between border-t border-kopi-line pt-4">
            <span className="font-body text-sm text-kopi-ink-soft">
              Harga Bersih
            </span>
            <span className="font-display text-2xl font-bold text-kopi-heritage">
              {formatIDR(FEATURED.price)}
            </span>
          </div>
        </div>

        {/* Secondary list — same tag placement pattern as the featured
            card (top-right), so the eye doesn't have to relearn where
            to look for it between the two layouts. */}
        <ul className="flex flex-col gap-4 lg:col-span-5">
          {SECONDARY.map((item) => (
            <li
              key={item.name}
              className="relative border border-kopi-line bg-kopi-bg-raised p-4"
            >
              <div className="absolute right-4 top-4">
                <TagPill label={item.tag} />
              </div>
              <div className="max-w-[75%]">
                <p className="font-body text-base font-bold leading-snug text-kopi-ink md:text-lg">
                  {item.name}
                </p>
                <p className="mt-0.5 font-body text-sm leading-tight text-kopi-ink-soft">
                  {item.note}
                </p>
              </div>
              <p className="mt-2 font-body text-sm font-bold text-kopi-ink">
                {formatIDR(item.price)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
