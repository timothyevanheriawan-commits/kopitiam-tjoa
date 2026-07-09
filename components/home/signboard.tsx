export function Signboard() {
  return (
    <div className="relative inline-block max-w-full -rotate-1 transform-gpu">
      {/* Outer enamel frame — the one hard-shadow anchor on the homepage. */}
      <div className="border-4 border-kopi-ink bg-kopi-bg p-1 shadow-(--shadow-stamp-lg)">
        <div className="relative border-2 border-kopi-ink bg-kopi-heritage px-8 py-8 text-center sm:px-12 sm:py-10 md:px-16 md:py-12">
          <p
            lang="zh"
            className="mb-2 mr-[-0.2em] font-signage text-2xl tracking-[0.2em] text-kopi-bg sm:text-3xl md:text-4xl"
          >
            蔡記
          </p>

          <h1 className="font-display text-3xl font-black leading-none tracking-tight text-kopi-bg sm:text-5xl md:text-6xl">
            KOPITIAM TJOA
          </h1>

          <div className="mx-auto my-4 h-0.5 w-16 bg-kopi-bg/30" />

          <p className="mr-[-0.25em] font-utility text-xs font-bold uppercase tracking-[0.25em] text-kopi-bg/90">
            Est. 1968 · Surabaya
          </p>
        </div>
      </div>
    </div>
  );
}
