import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Alert, AlertDescription, AlertTitle, ExclamationTriangleIcon } from "@/components";
import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import { Info_App, Paths } from "@/lib/constants";
import { api } from "@/trpc/server";
import * as React from "react";
import { Billing } from "./_components/BillingPage";
import { BillingSkeleton } from "./_components/BillingSkeleton";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Billing",
  description: "Manage your billing and subscription",
};

export default async function BillingPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

  const stripePromises = Promise.all([api.stripe.getPlans.query(), api.stripe.getPlan.query()]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your billing and subscription</p>
      </div>
      <React.Suspense fallback={<BillingSkeleton />}>
        <Billing stripePromises={stripePromises} />
      </React.Suspense>
    </div>
  );
}
