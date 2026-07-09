import { GenerationSpread } from "@/components/about/generation-spread";
import type { GenerationEntry } from "@/lib/about-content";

export function GenerationRow({
  entry,
  index,
}: {
  entry: GenerationEntry;
  index: number;
}) {
  const reversed = index % 2 === 1;

  return (
    <div
      className={`grid grid-cols-1 items-start gap-6 lg:grid-cols-[auto_1fr] ${
        reversed ? "lg:grid-cols-[1fr_auto]" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className={`folio-number lg:pt-2 ${
          reversed ? "lg:order-last lg:text-right" : ""
        }`}
      >
        0{index + 1}
      </div>

      {/* Removed "group" + hover:border-kopi-ink — this card has no
          click/expand behavior, so a hover reaction was implying an
          affordance that doesn't exist (Norman: signifiers must match
          real affordances). If progressive disclosure is added later
          (e.g. a "Baca selengkapnya" toggle), reintroduce hover/focus
          styling tied to that specific control, not the whole card. */}
      <div className="ledger-entry p-6 pl-8 md:p-10 md:pl-12">
        <GenerationSpread entry={entry} reversed={reversed} />
      </div>
    </div>
  );
}
