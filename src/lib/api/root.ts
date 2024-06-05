import { apiKeyRouter } from "./routers/api-key/api-key.procedure";
import { stripeRouter } from "./routers/stripe/stripe.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  apiKey: apiKeyRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
