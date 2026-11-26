import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ambilUrlSupabase } from "@/lib/supabase/url";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!key) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let url;
  try {
    url = ambilUrlSupabase();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
