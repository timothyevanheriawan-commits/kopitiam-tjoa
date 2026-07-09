// app/admin/login/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/brand/brand-mark";
import { AdminButton } from "@/components/admin/admin-button";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError("Email atau kata sandi salah.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-kopi-bg px-6 py-16">
      {/* One watermark per page, hero-equivalent context, per the
          project's own governing rule — this IS this page's hero. */}
      <span
        aria-hidden="true"
        className="watermark -bottom-16 -right-10 select-none"
      >
        蔡記
      </span>

      <Reveal className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark className="h-14 w-14" />
          <p className="mt-4 font-utility text-xs font-bold uppercase tracking-widest text-kopi-signage">
            Akses Staf
          </p>
          <h1 className="mt-2 font-display text-3xl text-kopi-ink tracking-tight">
            Masuk ke Dasbor
          </h1>
          <p className="mt-2 font-body text-sm text-kopi-ink-soft">
            Khusus staf Kopitiam Tjoa, sejak 1968.
          </p>
        </div>

        <div className="ledger-entry p-6 shadow-(--shadow-stamp-md) md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-utility text-xs uppercase tracking-widest text-kopi-ink-soft"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-kopi-line bg-kopi-bg px-4 py-3 font-body text-sm text-kopi-ink transition-colors focus-visible:border-kopi-heritage-deep"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-utility text-xs uppercase tracking-widest text-kopi-ink-soft"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-kopi-line bg-kopi-bg px-4 py-3 font-body text-sm text-kopi-ink transition-colors focus-visible:border-kopi-heritage-deep"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="border border-kopi-signage bg-kopi-signage-soft px-3 py-2 font-body text-sm text-kopi-signage"
              >
                {error}
              </p>
            )}

            <AdminButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-xs text-kopi-ink-soft">
          Bukan staf?{" "}
          <Link  
            href="/"
            className="text-kopi-heritage-deep underline underline-offset-2 hover:text-kopi-ink"
          >
            Kembali ke beranda
          </Link>
          .
        </p>
      </Reveal>
    </main>
  );
}
