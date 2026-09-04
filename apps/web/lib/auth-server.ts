import { headers } from "next/headers"

/**
 * Fetch the Better Auth session for RSC (read-only).
 *
 * Always pass disableRefresh=true: Next RSC cannot apply Set-Cookie to the
 * browser. Sliding expiry is handled in the browser by SessionRefresher
 * (useSession → POST /get-session when needsRefresh, via deferSessionRefresh).
 *
 * @see https://www.better-auth.com/docs/concepts/session-management#defer-session-refresh
 * @see https://www.better-auth.com/docs/integrations/next
 */
export async function getServerSession(cookieHeader?: string | null) {
  const cookie = cookieHeader ?? (await headers()).get("cookie") ?? ""

  if (!cookie) return null

  const response = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/auth/get-session?disableRefresh=true`,
    {
      headers: {
        cookie,
      },
      // Never use a cookie jar — Set-Cookie from the API must not stick on Node.
      credentials: "omit",
      cache: "no-store",
    },
  )

  if (!response.ok) {
    return null
  }

  const session = await response.json()
  // Better Auth returns JSON `null` when there is no session (still HTTP 200).
  return session
}

export async function getServerCookieHeaders() {
  const headersList = await headers()
  return {
    cookie: headersList.get("cookie") || "",
  }
}
