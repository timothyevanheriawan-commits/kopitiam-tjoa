"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-kopi-ink tracking-tight mb-3">
          Dasbor gagal dimuat
        </h1>
        <p className="font-body text-sm text-kopi-ink-soft leading-relaxed mb-6">
          Terjadi kesalahan saat memuat dasbor admin. Coba muat ulang.
        </p>
        <button
          onClick={reset}
          className="border border-kopi-line px-4 py-2 font-body text-sm text-kopi-ink hover:bg-kopi-line/20"
        >
          Muat Ulang
        </button>
      </div>
    </main>
  );
}
