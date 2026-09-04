import "dotenv/config"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { openAPI } from "better-auth/plugins"
import { WEB_TRUSTED_ORIGINS } from "@/lib/trusted-origins"
import {
  SESSION_EXPIRES_IN_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
} from "@/lib/session"

const webApp = process.env.APP_URL || "http://localhost:3000"
const apiBase =
  process.env.NODE_ENV === "production"
    ? (process.env.API_URL as string)
    : "http://localhost:3001"

export const auth = betterAuth({
  baseURL: apiBase,
  onAPIError: {
    errorURL: `${webApp}/`,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Sliding sessions. GET /get-session is read-only and returns needsRefresh;
  // the browser client POSTs to refresh so Set-Cookie lands in the browser.
  // Server RSC / proxy / actions / API middleware must not refresh cookies.
  // Do not set expiresIn above 400 days — Chrome and better-call 500 the OAuth callback.
  session: {
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
    deferSessionRefresh: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      allowDifferentEmails: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Sign-in only: email/profile/openid (Better Auth defaults). Extra Google
      // APIs (Calendar, Drive, …) belong on a later linkSocial call, not login.
      //
      // Do NOT set prompt: "consent" here — it re-lists previously granted
      // extra scopes on every sign-in. Offline access still yields a refresh
      // token on first grant / when new scopes are added.
      accessType: "offline",
      prompt: "select_account",
    },
  },
  plugins: [openAPI()],
  trustedOrigins: WEB_TRUSTED_ORIGINS,
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.DOMAIN as string,
    },
  },
})
