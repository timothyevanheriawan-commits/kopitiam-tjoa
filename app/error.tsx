"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side rendering/logging only ever sees console.error in this
    // project (no monitoring integration yet) — at minimum, log client
    // errors here too so they aren't silently swallowed.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <span className="font-utility text-xs uppercase tracking-widest text-kopi-signage font-bold block mb-3">
          Terjadi Kesalahan
        </span>
        <h1 className="font-display text-2xl text-kopi-ink tracking-tight mb-3">
          Ada yang tidak beres
        </h1>
        <p className="font-body text-sm text-kopi-ink-soft leading-relaxed mb-6">
          Mohon maaf, terjadi kesalahan pada halaman ini. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="border border-kopi-line px-4 py-2 font-body text-sm text-kopi-ink hover:bg-kopi-line/20"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
