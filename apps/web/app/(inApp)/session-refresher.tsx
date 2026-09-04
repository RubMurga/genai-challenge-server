"use client"

import { authClient } from "@/lib/auth"

/**
 * Browser-side session touch. With deferSessionRefresh, useSession GETs the
 * session and POSTs /get-session when needsRefresh is true so Set-Cookie lands
 * in the browser (RSC/proxy cannot).
 */
export function SessionRefresher() {
  authClient.useSession()
  return null
}
