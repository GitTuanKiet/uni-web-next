import Link from "next/link";

import {
  Button, Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CheckIcon
} from "@/components";
import { formatDate } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";
import { ManageSubscriptionForm } from "./ManageSubscriptionForm";
import { Paths } from "@/lib/constants";

interface BillingProps {
  stripePromises: Promise<
    [RouterOutputs["stripe"]["getPlans"], RouterOutputs["stripe"]["getPlan"]]
  >;
  paypalPromises: Promise<
    [RouterOutputs["paypal"]["getPlans"], RouterOutputs["paypal"]["getPlan"]]
  >;
}

export async function Billing({ stripePromises, paypalPromises }: BillingProps) {
  // const [plans, plan] = await stripePromises;
  const [plans, plan] = await paypalPromises;

  return (
    <>
      <section>
        <Card className="space-y-2 p-8">
          <h3 className="text-lg font-semibold sm:text-xl">{plan?.name ?? "Free"} plan</h3>
          <p className="text-sm text-muted-foreground">
            {!plan?.isPro
              ? "The free plan is limited to 5 API KEY. Upgrade to the Pro plan to unlock unlimited API KEY."
              : plan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on "}
            {/* {plan?.stripeCurrentPeriodEnd ? formatDate(plan.stripeCurrentPeriodEnd) : null} */}
            {
              plan?.paypalCurrentPeriodEnd && plan.paypalCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
              ? formatDate(plan.paypalCurrentPeriodEnd)
              : null
            }
          </p>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {plans.map((item, i) => (
          <Card key={i} className="flex flex-col p-2">
            <CardHeader>
              <CardTitle className="line-clamp-1">{item.name}</CardTitle>
              <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-full flex-1 space-y-6">
              {/* <div className="text-3xl font-bold">
                {item.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div> */}
              {item.pricing}
              <div className="space-y-2">
                {item.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="aspect-square shrink-0 rounded-full bg-foreground p-px text-background">
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {item.name === "Free" ? (
                <Button className="w-full" asChild>
                  <Link href={Paths.AiContent}>
                    Get started
                    <span className="sr-only">Get started</span>
                  </Link>
                </Button>
              ) : (
                // <ManageSubscriptionForm
                //   stripePriceId={item.stripePriceId}
                //   isPro={plan?.isPro ?? false}
                //   stripeCustomerId={plan?.stripeCustomerId}
                //   stripeSubscriptionId={plan?.stripeSubscriptionId}
                // />
                <ManageSubscriptionForm
                  paypalPlanId={item.paypalPlanId}
                  paypalTrialPlanId={item.paypalTrialPlanId}
                  isPro={plan?.isPro ?? false}
                  paypalPayerId={plan?.paypalPayerId}
                  paypalSubscriptionId={plan?.paypalSubscriptionId}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}
