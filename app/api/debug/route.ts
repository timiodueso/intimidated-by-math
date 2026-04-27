import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll();
  const supabaseCookies = allCookies.filter((c) =>
    c.name.startsWith("sb-")
  );

  let user = null;
  let getUserError = null;
  let sessionFromCookies = null;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: sessionData } = await supabase.auth.getSession();
    sessionFromCookies = sessionData.session
      ? { user_id: sessionData.session.user.id, email: sessionData.session.user.email, expires_at: sessionData.session.expires_at }
      : null;

    const { data, error } = await supabase.auth.getUser();
    user = data.user ? { id: data.user.id, email: data.user.email } : null;
    getUserError = error?.message ?? null;
  } catch (e: unknown) {
    getUserError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    total_cookies: allCookies.length,
    supabase_cookies: supabaseCookies.map((c) => ({
      name: c.name,
      value_length: c.value.length,
      value_prefix: c.value.substring(0, 20),
    })),
    session_from_cookies: sessionFromCookies,
    user_from_getUser: user,
    getUser_error: getUserError,
    site_url_env: process.env.NEXT_PUBLIC_SITE_URL ?? "NOT SET",
  });
}
