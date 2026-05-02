import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the auth callback route handle itself entirely — running getUser() here
  // before the code exchange happens would corrupt the PKCE code verifier cookie.
  if (pathname === "/auth/callback") {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

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
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          // IMPORTANT: do NOT override httpOnly here.
          // Supabase defaults to httpOnly: false so the browser client can read
          // session cookies. Overriding to true breaks mobile browser auth state.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  // If getUser() fails (network error / Supabase outage), allow the request
  // through rather than incorrectly redirecting to login — which would cause
  // a loop on mobile where network calls can fail transiently.
  if (getUserError) {
    console.error("[proxy] getUser failed:", getUserError.message);
    return supabaseResponse;
  }

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthRoute) {
    // Returning users who are onboarded → home; new users → onboarding
    const onboarded =
      request.cookies.get("itbm_onboarded")?.value === "1" ||
      user.user_metadata?.onboarding_complete === true;
    return NextResponse.redirect(
      new URL(onboarded ? "/home" : "/onboarding", request.url)
    );
  }

  // Authenticated from here on — enforce onboarding for app routes
  if (user && pathname !== "/onboarding") {
    // Fast path: trust the cookie set by the onboarding page on completion
    const onboardedCookie =
      request.cookies.get("itbm_onboarded")?.value === "1";

    if (!onboardedCookie) {
      const onboardingComplete =
        user.user_metadata?.onboarding_complete === true;

      if (!onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // Metadata says complete — stamp the cookie so we skip this check next time
      supabaseResponse.cookies.set("itbm_onboarded", "1", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  // Onboarding route: only reachable by authenticated + not-yet-onboarded users.
  // If they're already done, bounce them home.
  if (user && pathname === "/onboarding") {
    const onboarded =
      request.cookies.get("itbm_onboarded")?.value === "1" ||
      user.user_metadata?.onboarding_complete === true;
    if (onboarded) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
