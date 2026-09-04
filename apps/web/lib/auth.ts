import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL + "/api/auth",
  credentials: "include",
})

export { authClient }
