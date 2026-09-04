/** Chrome / better-call reject cookie Max-Age above 400 days. Larger values 500 OAuth. */
export const COOKIE_MAX_AGE_CAP_SECONDS = 60 * 60 * 24 * 400

/** App session TTL. Must stay ≤ COOKIE_MAX_AGE_CAP_SECONDS. Sliding keeps active users signed in. */
export const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 60 // 60 days

/** How often activity may slide expiresAt (and the cookie Max-Age). */
export const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24 // 1 day
