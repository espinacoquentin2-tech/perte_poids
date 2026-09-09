import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, hasSupabaseConfig } from "./config";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseConfig) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
<<<<<<< ours
  const { url, key } = getSupabaseConfig();
  const supabase = createServerClient(url, key, {
=======
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
>>>>>>> theirs
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
<<<<<<< ours
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
=======
  const isLoginPage = request.nextUrl.pathname === "/login";
  if (!user && !isLoginPage) {
>>>>>>> theirs
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
<<<<<<< ours
  if (user && request.nextUrl.pathname.startsWith("/login")) {
=======
  if (user && isLoginPage) {
>>>>>>> theirs
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return response;
}
