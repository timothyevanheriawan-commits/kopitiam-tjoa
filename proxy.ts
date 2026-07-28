import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginRoute = pathname === "/admin/login";

  // /api/admin/* route handlers already re-check auth themselves (defense
  // in depth), but this stops unauthenticated requests before they reach
  // the handler at all, and means there's one place to fix if a new
  // admin route forgets its own check.
  if (isAdminApiRoute && !user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  if (isAdminPage && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

// Only run this middleware (and its Supabase auth check) on the routes
// that actually need it — otherwise every static asset, image, and public
// page request pays for a getUser() call it never needed.
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
