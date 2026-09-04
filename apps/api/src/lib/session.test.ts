import { describe, expect, it } from "vitest"
import {
  COOKIE_MAX_AGE_CAP_SECONDS,
  SESSION_EXPIRES_IN_SECONDS,
} from "./session"

describe("session cookie Max-Age", () => {
  it("stays at or under the 400-day browser / better-call cap", () => {
    expect(SESSION_EXPIRES_IN_SECONDS).toBeLessThanOrEqual(
      COOKIE_MAX_AGE_CAP_SECONDS,
    )
  })

  it("does not overflow signed 32-bit cookie Max-Age", () => {
    expect(SESSION_EXPIRES_IN_SECONDS).toBeLessThanOrEqual(2_147_483_647)
  })
})
