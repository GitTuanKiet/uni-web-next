import { freePlan, proPlan, subscriptionPlans } from "@/subscriptions/data";
import type { ProtectedTRPCContext } from "@/lib/api/trpc";
import { stripe } from "@/lib/stripe";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import type { ManageSubscriptionInput } from "./stripe.input";

export const getStripePlans = async (ctx: ProtectedTRPCContext) => {
  try {
    const customer = await ctx.db.query.customers.findFirst({
      where: (table, { eq }) => eq(table.userId, ctx.user.id),
      columns: {
        id: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    const proPrice = await stripe.prices.retrieve(proPlan.stripePriceId);

    return subscriptionPlans.map((plan) => {
      return {
        ...plan,
        price:
          plan.stripePriceId === proPlan.stripePriceId
            ? formatPrice((proPrice.unit_amount ?? 0) / 100, {
                currency: proPrice.currency,
              })
            : formatPrice(0 / 100, { currency: proPrice.currency }),
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStripePlan = async (ctx: ProtectedTRPCContext) => {
  try {
    const customer = await ctx.db.query.customers.findFirst({
      where: (table, { eq }) => eq(table.userId, ctx.user.id),
      columns: {
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
        stripeSubscriptionId: true,
        stripeCustomerId: true,
      },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    // Check if user is on a pro plan
    const isPro =
      !!customer.stripePriceId &&
      (customer.stripeCurrentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now();

    const plan = isPro ? proPlan : freePlan;

    // Check if user has canceled subscription
    let isCanceled = false;
    if (isPro && !!customer.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(customer.stripeSubscriptionId);
      isCanceled = stripePlan.cancel_at_period_end;
    }

    return {
      ...plan,
      stripeSubscriptionId: customer.stripeSubscriptionId,
      stripeCurrentPeriodEnd: customer.stripeCurrentPeriodEnd,
      stripeCustomerId: customer.stripeCustomerId,
      isPro,
      isCanceled,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const manageSubscription = async (
  ctx: ProtectedTRPCContext,
  input: ManageSubscriptionInput,
) => {
  const billingUrl = absoluteUrl("/dashboard/billing");

  const userCustomer = await ctx.db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, ctx.user.id),
    columns: {
      id: true,
      email: true,
    },
    with: {
      customer: {
        columns: {
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
        },
      },
    },
  });

  if (!userCustomer) {
    throw new Error("User not found.");
  }

  // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
  if (input.isPro && input.stripeCustomerId) {
    const stripeSession = await ctx.stripe.billingPortal.sessions.create({
      customer: input.stripeCustomerId,
      return_url: billingUrl,
    });

    return {
      url: stripeSession.url,
    };
  }

  // If the user is not subscribed to a plan, we create a Stripe Checkout session
  const stripeSession = await ctx.stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: userCustomer.email,
    line_items: [
      {
        price: input.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: userCustomer.id,
    },
  });

  return {
    url: stripeSession.url,
  };
};
