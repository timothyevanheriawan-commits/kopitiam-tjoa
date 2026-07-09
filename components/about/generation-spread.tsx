import type { GenerationEntry } from "@/lib/about-content";
import { GenerationIllustration } from "@/components/about/generation-illustration";

export function GenerationSpread({
  entry,
  reversed,
}: {
  entry: GenerationEntry;
  reversed: boolean;
}) {
  return (
    // Removed border-b/last:border-0 — this article is always the sole
    // child of its own ledger-entry wrapper (see GenerationRow), so that
    // divider could never render. The ledger-entry card itself already
    // separates generations; no internal divider is needed.
    <article className="grid grid-cols-1 items-center gap-8 py-4 md:grid-cols-12 md:gap-12">
      <figure
        className={[
          "justify-self-center md:col-span-5",
          reversed ? "md:order-last" : "md:order-first",
        ].join(" ")}
      >
        <div className="border border-kopi-line bg-kopi-bg-raised p-2">
          <GenerationIllustration variant={entry.illustration} />
        </div>
        <figcaption className="mt-2 font-body text-xs text-kopi-ink-soft">
          Arsip Keluarga Tjoa · {entry.years}
        </figcaption>
      </figure>

      <div
        className={[
          "flex flex-col justify-center md:col-span-7",
          reversed ? "md:pr-4" : "md:pl-4",
        ].join(" ")}
      >
        {/* flex-wrap added: prevents overflow on narrow viewports when
            entry.role is a longer string */}
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="border border-kopi-line bg-kopi-bg-raised px-2.5 py-0.5 font-display text-sm font-bold text-kopi-heritage">
            {entry.years}
          </span>
          <span className="h-px w-4 bg-kopi-line" />
          <span className="font-body text-xs font-bold uppercase tracking-wider text-kopi-ink-soft">
            {entry.role}
          </span>
        </div>

        <h3 className="mb-4 font-display text-2xl font-black tracking-tight text-kopi-ink md:text-3xl">
          {entry.name}
        </h3>

        <p className="pull-quote mb-5">{entry.pullQuote}</p>

        <p className="font-body text-base leading-relaxed text-kopi-ink-soft">
          {entry.narrative}
        </p>
      </div>
    </article>
  );
}
