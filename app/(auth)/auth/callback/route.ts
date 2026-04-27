import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  // Use the configured site URL for the redirect so it's always correct in
  // production regardless of load-balancer / internal URL quirks.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    request.headers.get("x-forwarded-proto") + "://" + request.headers.get("host");

  if (code) {
    // Create the redirect response FIRST so the Supabase client can write
    // session cookies directly onto it. Using the shared server.ts client
    // (which writes via next/headers) attaches cookies to a phantom response
    // object that is discarded — the actual redirect the browser receives
    // would have no cookies, causing the login loop.
    const response = NextResponse.redirect(`${siteUrl}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // IMPORTANT: do NOT override httpOnly here.
            // Supabase sets httpOnly: false by default so that the browser
            // client can read session cookies via document.cookie. Forcing
            // httpOnly: true breaks mobile browser auth state.
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  return NextResponse.redirect(`${siteUrl}/login?error=auth_callback_failed`);
}
