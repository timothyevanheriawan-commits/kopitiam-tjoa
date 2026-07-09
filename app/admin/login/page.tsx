"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminButton } from "@/components/admin/admin-button";

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
    <main className="min-h-[calc(100vh-(--spacing(20)))] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="index-tag inline-block mb-4">STAF</p>
          <h1 className="font-display text-3xl text-kopi-ink tracking-tight mb-2">
            Masuk Admin
          </h1>
          <p className="font-body text-sm text-kopi-ink-soft">
            Khusus staf Kopitiam Tjoa.
          </p>
        </div>

        <div className="ledger-entry p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block font-utility text-xs uppercase tracking-widest text-kopi-ink-soft mb-2"
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
                className="w-full border border-kopi-line bg-kopi-bg px-4 py-3 font-body text-sm text-kopi-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:border-kopi-heritage"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-utility text-xs uppercase tracking-widest text-kopi-ink-soft mb-2"
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
                className="w-full border border-kopi-line bg-kopi-bg px-4 py-3 font-body text-sm text-kopi-ink focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </div>

            {error && (
              <p className="font-body text-sm text-kopi-signage" role="alert">
                {error}
              </p>
            )}

            <AdminButton
  type="submit"
  variant="primary"
  size="md"
  disabled={isSubmitting}
  className="w-full press-button--full"
>
              {isSubmitting ? "Memproses..." : "Masuk"}
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-xs text-kopi-ink-soft">
          Bukan staf? Kembali ke{" "}
          <a href="/" className="underline">
            beranda
          </a>
          .
        </p>
      </div>
    </main>
  );
}
