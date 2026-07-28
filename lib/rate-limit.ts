import { createServiceClient } from "@/lib/supabase/service";

const WINDOW_MINUTES = 10;
const MAX_REQUESTS = 3;

/**
 * Ambil IP client dari header. Vercel selalu set x-forwarded-for dengan
 * benar di edge network mereka, jadi header ini bisa dipercaya di
 * deployment ini (beda cerita kalau di belakang proxy custom yang tidak
 * dikontrol sendiri).
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * true kalau IP ini masih boleh membuat pesanan baru.
 */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const supabase = createServiceClient();
  const windowStart = new Date(
    Date.now() - WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabase
    .from("order_rate_limit")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", windowStart);

  if (error) {
    // Fail open: kalau pengecekan rate limit sendiri yang gagal, jangan
    // sampai pesanan customer asli ikut tertolak gara-gara masalah
    // infrastruktur kita sendiri, bukan salah mereka.
    console.error("Gagal cek rate limit:", error);
    return true;
  }

  return (count ?? 0) < MAX_REQUESTS;
}

/** Catat 1 pesanan berhasil dibuat dari IP ini. */
export async function recordOrderAttempt(ip: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("order_rate_limit")
    .insert({ ip_address: ip });

  if (error) {
    // Non-fatal — kalau logging attempt gagal, order aslinya sudah
    // sukses dibuat, tidak perlu digagalkan cuma karena ini.
    console.error("Gagal mencatat rate limit attempt:", error);
  }
}

const LOGIN_WINDOW_MINUTES = 15;
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * true kalau IP ini masih boleh mencoba login admin. Dicek SEBELUM
 * memanggil signInWithPassword, untuk menahan brute-force / credential
 * stuffing terhadap satu-satunya pintu masuk privileged di aplikasi ini.
 */
export async function checkLoginRateLimit(ip: string): Promise<boolean> {
  const supabase = createServiceClient();
  const windowStart = new Date(
    Date.now() - LOGIN_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count, error } = await supabase
    .from("login_rate_limit")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", windowStart);

  if (error) {
    // Fail open here too, same reasoning as checkRateLimit: an infra
    // problem on our end shouldn't lock legitimate staff out entirely.
    console.error("Gagal cek rate limit login:", error);
    return true;
  }

  return (count ?? 0) < MAX_LOGIN_ATTEMPTS;
}

/** Catat 1 percobaan login (berhasil atau gagal) dari IP ini. */
export async function recordLoginAttempt(ip: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("login_rate_limit")
    .insert({ ip_address: ip });

  if (error) {
    console.error("Gagal mencatat rate limit login:", error);
  }
}
