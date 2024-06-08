"use client";

import { type RouterOutputs } from "@/trpc/shared";
import * as React from "react";
import { NewApiKey } from "./NewAK";
import { ApiKeyCard } from "./AKCard";
import { LIMITED_API_KEY } from "@/lib/constants";

interface ApiKeysProps {
  promises: Promise<[RouterOutputs["apiKey"]["myApiKeys"], RouterOutputs["stripe"]["getPlan"]]>;
}

export function ApiKeys({ promises }: ApiKeysProps) {
  /**
   * use is a React Hook that lets you read the value of a resource like a Promise or context.
   * @see https://react.dev/reference/react/use
   */
  const [apiKeys, subscriptionPlan] = React.use(promises);

  /**
   * useOptimistic is a React Hook that lets you show a different state while an async action is underway.
   * It accepts some state as an argument and returns a copy of that state that can be different during the duration of an async action such as a network request.
   * @see https://react.dev/reference/react/useOptimistic
   */
  const [optimisticApiKeys, setOptimisticApiKeys] = React.useOptimistic(
    apiKeys,
    (
      state,
      {
        action,
        apiKey,
      }: {
        action: "add" | "delete" | "update";
        apiKey: RouterOutputs["apiKey"]["myApiKeys"][number];
      },
    ) => {
      switch (action) {
        case "delete":
          return state.filter((k) => k.id !== apiKey.id);
        case "update":
          return state.map((k) => (k.id === apiKey.id ? apiKey : k));
        default:
          return [...state, apiKey];
      }
    },
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewApiKey
        isEligible={
          (optimisticApiKeys.length < LIMITED_API_KEY || subscriptionPlan?.isPro) ?? false
        }
        setOptimisticApiKeys={setOptimisticApiKeys}
      />
      {optimisticApiKeys.map((apiKey) => (
        <ApiKeyCard key={apiKey.id} apiKey={apiKey} setOptimisticApiKeys={setOptimisticApiKeys} />
      ))}
    </div>
  );
}
