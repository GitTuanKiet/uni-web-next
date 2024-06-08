import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import * as React from "react";
import { ApiKeys } from "./_components/AKs";
import { ApiKeysSkeleton } from "./_components/AKsSkeleton";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { myApiKeysSchema } from "@/lib/api/routers/api-key/api-key.input";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Api Keys",
  description: "Manage your API keys",
};

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { page, perPage } = myApiKeysSchema.parse(searchParams);

  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);
  
  const client_id = cookies().get("client_id")?.value ?? null;
  if (client_id) {
    redirect("/login/redirect?client_id=" + client_id);
  }

  const promises = Promise.all([
    api.apiKey.myApiKeys.query({ page, perPage }),
    api.stripe.getPlan.query(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Api Keys</h1>
        <p className="text-sm text-muted-foreground">Manage your API keys</p>
      </div>
      <React.Suspense fallback={<ApiKeysSkeleton />}>
        <ApiKeys promises={promises} />
      </React.Suspense>
    </div>
  );
}
