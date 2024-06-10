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
  features: [
    "Up to 6 apiKeys",
    "5 content per month",
    "Max 500 words per content",
    "Basic content types",
    "SEO optimization",
    "Access to Vietnamese templates",
    "24/7 support via email",
    "Basic content performance analytics",
  ],
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "Pro",
  description: "The Pro plan has unlimited apiKeys.",
  features: [
    "Unlimited apiKeys",
    "50 content per month",
    "Max 2000 words per content",
    "Content personalization",
    "All content types", 
    "SEO optimization",
    "Content personalization",
    "Multilingual support",
    "Intergation with social platforms",
    "Access to Vietnamese templates",
    "24/7 support via email",
    "Basic content performance analytics",
  ],
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID,
};

// export const businessPlan: SubscriptionPlan = {
//   name: "Business",
//   description: "The Business plan no limits.",
//   features: [
//     "Unlimited apiKeys",
//     "Unlimited content per month",
//     "Unlimited words per content",
//     "Content personalization",
//     "All content types", 
//     "SEO optimization",
//     "Content personalization",
//     "Multilingual support",
//     "Intergation with social platforms",
//     "Intergation with email marketing",
//     "Intergation with CRM",
//     "Access to Vietnamese templates",
//     "24/7 support via email",
//     "24/7 support via phone/chat",
//     "Advance content performance analytics",
//     "Image content generation",
//     "Video content generation",
//   ],
//   // stripePriceId: env.STRIPE_BUSINESS_MONTHLY_PLAN_ID,
//   stripePriceId: "business-monthly-plan-id"
// };

export const subscriptionPlans = [freePlan, proPlan];
