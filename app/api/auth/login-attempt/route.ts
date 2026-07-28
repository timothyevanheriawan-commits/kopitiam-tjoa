import { NextResponse } from "next/server";
import {
  checkLoginRateLimit,
  getClientIp,
  recordLoginAttempt,
} from "@/lib/rate-limit";

// The actual sign-in call has to happen client-side (it's what sets the
// Supabase auth cookies via the browser client), so this route can't wrap
// it directly. Instead the login page calls this FIRST: if the IP is over
// the attempt limit, we refuse before any credentials are even sent to
// Supabase Auth. Every call here — whether the eventual sign-in succeeds
// or fails — counts as one attempt, same as a standard login throttle.
export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  const withinLimit = await checkLoginRateLimit(clientIp);
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan masuk, coba lagi nanti." },
      { status: 429 },
    );
  }

  await recordLoginAttempt(clientIp);
  return NextResponse.json({ ok: true });
}
