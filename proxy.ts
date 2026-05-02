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
    const onboarded =
      request.cookies.get("itbm_onboarded")?.value === "1" ||
      user.user_metadata?.onboarding_complete === true;
    if (!onboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    const diagnosed =
      request.cookies.get("itbm_diagnosed")?.value === "1" ||
      user.user_metadata?.diagnostic_complete === true;
    return NextResponse.redirect(
      new URL(diagnosed ? "/home" : "/diagnostic", request.url)
    );
  }

  // Authenticated from here on — enforce onboarding then diagnostic
  if (user && pathname !== "/onboarding") {
    const onboardedCookie =
      request.cookies.get("itbm_onboarded")?.value === "1";

    if (!onboardedCookie) {
      const onboardingComplete =
        user.user_metadata?.onboarding_complete === true;
      if (!onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      supabaseResponse.cookies.set("itbm_onboarded", "1", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }

    // After onboarding — enforce diagnostic for all routes except /diagnostic itself
    if (pathname !== "/diagnostic") {
      const diagnosedCookie =
        request.cookies.get("itbm_diagnosed")?.value === "1";

      if (!diagnosedCookie) {
        const diagnosticComplete =
          user.user_metadata?.diagnostic_complete === true;
        if (!diagnosticComplete) {
          return NextResponse.redirect(new URL("/diagnostic", request.url));
        }
        supabaseResponse.cookies.set("itbm_diagnosed", "1", {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
        });
      }
    }
  }

  // Onboarding: bounce completed users away
  if (user && pathname === "/onboarding") {
    const onboarded =
      request.cookies.get("itbm_onboarded")?.value === "1" ||
      user.user_metadata?.onboarding_complete === true;
    if (onboarded) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // Diagnostic: bounce completed users away
  if (user && pathname === "/diagnostic") {
    const diagnosed =
      request.cookies.get("itbm_diagnosed")?.value === "1" ||
      user.user_metadata?.diagnostic_complete === true;
    if (diagnosed) {
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
