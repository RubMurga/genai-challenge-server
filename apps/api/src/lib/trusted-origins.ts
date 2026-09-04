/** Browser origins allowed to call the API with credentials (CORS + Better Auth). */
export const WEB_TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.APP_URL,
  process.env.API_URL,
].filter((origin): origin is string => Boolean(origin))
