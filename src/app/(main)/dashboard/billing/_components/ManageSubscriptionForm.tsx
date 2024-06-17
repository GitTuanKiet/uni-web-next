"use client";

import * as React from "react";
import { redirect, useSearchParams } from "next/navigation";

import { Button, ExclamationTriangleIcon } from "@/components";
// import type { ManageSubscriptionInput } from "@/lib/api/routers/stripe/stripe.input";
import type { ManageSubscriptionInput } from "@/lib/api/routers/paypal/paypal.input";
import { api } from "@/trpc/react";
import { Paths } from "@/lib/constants";
import { toast } from "sonner";

export function ManageSubscriptionForm({
  isPro,
  // stripeCustomerId,
  // stripeSubscriptionId,
  // stripePriceId,
  paypalPlanId,
  paypalTrialPlanId,
  paypalPayerId,
  paypalSubscriptionId,
}: ManageSubscriptionInput) {
  const [isPending, startTransition] = React.useTransition();
  // const managePlanMutation = api.stripe.managePlan.useMutation();
  const managePlanMutation = api.paypal.managePlan.useMutation();

  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscription_id");
  const baToken = searchParams.get("ba_token");

  if (subscriptionId && baToken) {
    toast.info("Activating subscription...");
    // clear search params
    setTimeout(() => {
      try {
        window.history.replaceState({}, "", Paths.Billing);
      } catch (err) {
        
      }
    }, 3000);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const session = await managePlanMutation.mutateAsync({
          isPro,
          // stripeCustomerId,
          // stripeSubscriptionId,
          // stripePriceId,
          paypalPlanId,
          paypalTrialPlanId,
          paypalPayerId,
          paypalSubscriptionId,
        });

        if (session) {
          window.location.href = session.url ?? Paths.Billing;
        }
      } catch (err) {
        err instanceof Error
          ? toast.error(err.message, {
              icon: <ExclamationTriangleIcon className="h-5 w-5" />,
            })
          : toast.error("An error occurred", {
              icon: <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />,
            });
      }
    });
  }

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <Button className="w-full" disabled={isPending}>
        {isPending ? "Loading..." : isPro ? "Manage plan" : "Subscribe now"}
      </Button>
    </form>
  );
}
