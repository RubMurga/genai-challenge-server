import { NextResponse, NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up", "/learn-more"]

const isStaticAsset = (pathname: string) =>
  pathname.startsWith("/_next") ||
  pathname.startsWith("/favicon") ||
  /\.(ico|png|jpg|jpeg|gif|webp|svg|mp4|css|js|woff2?|ttf|eot)(\?|$)/i.test(
    pathname,
  )

/**
 * Optimistic auth gate only — check for the session cookie here, not get-session.
 * Calling get-session from the proxy refreshes the cookie on the server; that
 * Set-Cookie never reaches the browser and every navigation looks logged out.
 *
 * @see https://www.better-auth.com/docs/integrations/next#auth-protection
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (PUBLIC_PATHS.includes(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    const signIn = new URL("/sign-in", request.url)
    signIn.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`,
    )
    return NextResponse.redirect(signIn)
  }

  return NextResponse.next()
}
