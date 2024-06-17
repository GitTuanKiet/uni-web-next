import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import * as services from "./paypal.service";
import * as inputs from "./paypal.input";

export const paypalRouter = createTRPCRouter({
  getPlans: protectedProcedure.query(({ ctx }) => services.getPaypalPlans(ctx)),

  getPlan: protectedProcedure.query(({ ctx }) => services.getPaypalPlan(ctx)),

  managePlan: protectedProcedure
    .input(inputs.manageSubscriptionSchema)
    .mutation(({ ctx, input }) => services.manageSubscription(ctx, input)),
});
