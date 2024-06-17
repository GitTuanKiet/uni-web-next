import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_DATABASE_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DISCORD_CLIENT_ID: z.string().trim().min(1),
    DISCORD_CLIENT_SECRET: z.string().trim().min(1),
    GOOGLE_CLIENT_ID: z.string().trim().min(1),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.number().int().min(1),
    SMTP_USER: z.string().trim().min(1),
    SMTP_PASSWORD: z.string().trim().min(1),
    STRIPE_API_KEY: z.string().trim().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().trim().min(1),
    STRIPE_PRO_MONTHLY_PLAN_ID: z.string().trim().min(1),
    PAYPAL_WEBHOOK_ID: z.string().trim().min(1),
    PAYPAL_CLIENT_ID: z.string().trim().min(1),
    PAYPAL_CLIENT_SECRET: z.string().trim().min(1),
    PAYPAL_PRO_MONTHLY_PLAN_ID: z.string().trim().min(1),
    PAYPAL_PRO_TRIAL_PLAN_ID: z.string().trim().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_PREFIX: z.string().default(""),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_DOMAIN: z.string().default("localhost"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server-side env vars
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT ?? ""),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRO_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_MONTHLY_PLAN_ID,
    PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_PRO_MONTHLY_PLAN_ID: process.env.PAYPAL_PRO_MONTHLY_PLAN_ID,
    PAYPAL_PRO_TRIAL_PLAN_ID: process.env.PAYPAL_PRO_TRIAL_PLAN_ID,
    // Client-side env vars
    NEXT_PUBLIC_PREFIX: process.env.NEXT_PUBLIC_PREFIX,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
