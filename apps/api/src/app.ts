import { Hono } from "hono"
import { auth } from "@/lib/auth"
import { cors } from "hono/cors"
import { onboardingRouter } from "./routes/onboarding.router"
import { WEB_TRUSTED_ORIGINS } from "@/lib/trusted-origins"

const app = new Hono()

  .use(
    "/api/*",
    cors({
      origin: WEB_TRUSTED_ORIGINS,
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      maxAge: 600,
      credentials: true,
    }),
  )

  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .get("/", (c) => {
    return c.text("All Systems operational.")
  })
  .route("/api/onboarding", onboardingRouter)
  .onError((err, c) => {
    console.error(err)
    return c.json({ error: "Internal server error" }, 500)
  })

type AppType = typeof app

export { app, AppType }
