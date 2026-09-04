import { hc } from "hono/client"
import type { AppType } from "@backend/api"
import { getServerCookieHeaders } from "./auth-server"

// Server-side Hono client: forward the browser Cookie header only.
// credentials:"omit" — never let Node absorb API Set-Cookie (desyncs browser).
// Session sliding is browser-only (SessionRefresher + deferSessionRefresh).
const createAuthenticatedClient = async () => {
  const headers = await getServerCookieHeaders()

  return hc<AppType>(process.env.NEXT_PUBLIC_SERVER_URL!, {
    init: {
      credentials: "omit",
      headers: {
        cookie: headers.cookie,
        "Content-Type": "application/json",
      },
    },
  })
}

export const createOnboarding = async (
  businessType: string,
  platform: string,
  adBudget: string,
  productType: string,
  mainGoal: string,
  currentFollowers: string,
) => {
  const client = await createAuthenticatedClient()
  type OnboardingRequest = Parameters<
    typeof client.api.onboarding.$post
  >[0]["json"]
  const response = await client.api.onboarding.$post({
    json: {
      businessType,
      platform,
      adBudget,
      productType,
      mainGoal,
      currentFollowers,
    } as OnboardingRequest,
  })
  return response.json()
}

export const getOnboarding = async () => {
  const client = await createAuthenticatedClient()
  const response = await client.api.onboarding.$get()
  return response.json()
}

export const getOnboardingCount = async () => {
  const client = await createAuthenticatedClient()
  const response = await client.api.onboarding.count.$get()
  return response.json()
}
