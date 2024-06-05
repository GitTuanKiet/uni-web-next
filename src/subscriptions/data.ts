import { env } from "@/env";

export interface SubscriptionPlan {
  name: string;
  description: string;
  features: string[];
  stripePriceId: string;
}

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: "The free plan is limited to 5 apiKeys.",
  features: ["Up to 6 apiKeys", "Limited support"],
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The Pro plan has unlimited apiKeys.",
  features: ["Unlimited apiKeys", "Priority support"],
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
};

export const subscriptionPlans = [freePlan, proPlan];
