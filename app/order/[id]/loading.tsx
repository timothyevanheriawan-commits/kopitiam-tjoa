export default function OrderStatusLoading() {
  return (
    <main
      role="status"
      aria-label="Memuat status pesanan"
      className="mx-auto max-w-2xl px-6 py-16 md:py-24"
    >
      <div className="mb-10 border-b border-dashed border-kopi-line pb-6 text-center">
        <div className="mx-auto mb-3 h-6 w-32 animate-pulse rounded-full bg-kopi-line/60" />
        <div className="mx-auto mb-2 h-9 w-40 animate-pulse rounded-sm bg-kopi-line/50" />
        <div className="mx-auto h-4 w-28 animate-pulse rounded-sm bg-kopi-line/40" />
      </div>

      {/* Step-progress skeleton — same 4-node shape as the real
          tracker, so the page doesn't reflow once live data lands. */}
      <ol className="mb-10 flex items-start justify-between">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-kopi-line/50" />
            <div className="h-3 w-14 animate-pulse rounded-sm bg-kopi-line/40" />
          </li>
        ))}
      </ol>

      <div className="ledger-entry space-y-4 p-6 md:p-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div
              className="h-4 animate-pulse rounded-sm bg-kopi-line/50"
              style={{ width: `${50 + i * 10}%` }}
            />
            <div className="h-4 w-14 shrink-0 animate-pulse rounded-sm bg-kopi-line/50" />
          </div>
        ))}
      </div>
    </main>
  );
}
