import { createMiddleware } from "hono/factory"
import { auth } from "@/lib/auth"
import { HonoEnv } from "@/types/global"

/**
 * Validate the session for API routes without writing cookies.
 *
 * Better Auth: pass disableRefresh so getSession never Set-Cookies here.
 * Server actions / RSC call these routes with the browser Cookie header;
 * any Set-Cookie on that hop never reaches the browser and desyncs the session.
 * Sliding expiry is browser-only (SessionRefresher + deferSessionRefresh).
 *
 * @see https://www.better-auth.com/docs/concepts/session-management#defer-session-refresh
 */
export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
    query: { disableRefresh: true },
  })

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  c.set("user", session.user)
  c.set("session", session.session)
  return next()
})
