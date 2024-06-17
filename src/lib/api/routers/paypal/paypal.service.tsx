import { freePlan, proPlan, subscriptionPlans } from "@/subscriptions/data";
import type { ProtectedTRPCContext } from "@/lib/api/trpc";
import { paypal } from "@/lib/paypal";
import { absoluteUrl, formatPrice } from "@/lib/utils";
import type { ManageSubscriptionInput } from "./paypal.input";

export const getPaypalPlans = async (ctx: ProtectedTRPCContext) => {
  try {
    const payer = await ctx.db.query.payers.findFirst({
      where: (table, { eq }) => eq(table.email, ctx.user.email),
      columns: {
        id: true,
        paypalPayerId: true,
      },
    });

    if (!payer) {
      throw new Error("Payer not found.");
    }
    
    const paypalPlanId = payer.paypalPayerId ? proPlan.paypalPlanId : proPlan.paypalTrialPlanId!;

    const proPrice = await paypal.plans.retrieve(paypalPlanId);
    const billing_cycles = proPrice?.billing_cycles ?? null;
    
    return subscriptionPlans.map((plan) => {
      return {
        ...plan,
        pricing:
        <div className="text-3xl font-bold">
          {plan.paypalPlanId === proPlan.paypalPlanId && billing_cycles ?
            <>
            {billing_cycles.map((cycle, i) => {
              const price = formatPrice(cycle.pricing_scheme.fixed_price.value, { currency: cycle.pricing_scheme.fixed_price.currency_code });
              const interval_unit = cycle.frequency.interval_unit.toLocaleLowerCase();
              const tenure_type = cycle.tenure_type.toUpperCase();

              if (!payer.paypalPayerId) {
                if (tenure_type === 'TRIAL') 
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-accent-foreground">
                        {`Try ${cycle.frequency.interval_count} ${interval_unit} for only ${price} now!`}
                        </span>
                    </div>
                  );
              } else {
                return (
                  <div key={i} className="flex items-center gap-2">
                    {price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {`/${interval_unit}`}
                    </span>
                  </div>
                );
              }
            })}
            </> :
            <>
              <span className="text-accent-foreground">
                {'Let\'s get started for free!'}
              </span>
            </>}
        </div>
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getPaypalPlan = async (ctx: ProtectedTRPCContext) => {
  try {
    const payer = await ctx.db.query.payers.findFirst({
      where: (table, { eq }) => eq(table.email, ctx.user.email),
      columns: {
        paypalPlanId: true,
        paypalPayerId: true,
        paypalSubscriptionId: true,
        paypalCurrentPeriodEnd: true,
      },
    });

    if (!payer) {
      throw new Error("Payer not found.");
    }

    // Check if user is on a pro plan
    const isPro =
      !!payer.paypalPlanId &&
      (payer.paypalCurrentPeriodEnd?.getTime() ?? 0) + 86_400_000 > Date.now();

    const plan = isPro ? proPlan : freePlan;

    // Check if user has canceled subscription
    let isCanceled = false;
    if (isPro && !!payer.paypalSubscriptionId) {
      const paypalPlan = await paypal.subscriptions.retrieve(payer.paypalSubscriptionId);
      isCanceled = paypalPlan.status === "CANCELLED";
    }

    return {
      ...plan,
      paypalSubscriptionId: payer.paypalSubscriptionId,
      paypalPayerId: payer.paypalPayerId,
      paypalCurrentPeriodEnd: payer.paypalCurrentPeriodEnd,
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

  const userPayer = await ctx.db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, ctx.user.id),
    columns: {
      id: true,
      email: true,
    },
    with: {
      payer: {
        columns: {
          paypalPayerId: true,
        },
      },
    },
  });

  if (!userPayer) {
    throw new Error("User not found.");
  }

  if (input.isPro && input.paypalSubscriptionId) {
    const paypalSession = await ctx.paypal.billingPortal.sessions.create({
      subscriptionId: input.paypalSubscriptionId,
    });

    return {
      url: paypalSession.url
    };
  }

  const paypalSession = await ctx.paypal.checkout.sessions.create({
    returnUrl: billingUrl,
    cancelUrl: billingUrl,
    userId: ctx.user.id,
    planId: userPayer.payer.paypalPayerId ? proPlan.paypalPlanId : proPlan.paypalTrialPlanId!,
    quantity: 1,
    emailAddress: userPayer.email,
  });

  return {
    url: paypalSession.links[0]?.href,
  };
};