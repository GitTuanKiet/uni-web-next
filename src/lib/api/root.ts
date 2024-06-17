import { apiKeyRouter } from "./routers/api-key/api-key.procedure";
import { paypalRouter } from "./routers/paypal/paypal.procedure";
import { stripeRouter } from "./routers/stripe/stripe.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  apiKey: apiKeyRouter,
  stripe: stripeRouter,
  paypal: paypalRouter,
});

export type AppRouter = typeof appRouter;
