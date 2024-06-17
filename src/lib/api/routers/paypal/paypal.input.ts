import { z } from "zod";

export const manageSubscriptionSchema = z.object({
  paypalPlanId: z.string(),
  paypalTrialPlanId: z.string().optional().nullable(),
  paypalPayerId: z.string().optional().nullable(),
  paypalSubscriptionId: z.string().optional().nullable(),
  isPro: z.boolean(),
});

export type ManageSubscriptionInput = z.infer<typeof manageSubscriptionSchema>;