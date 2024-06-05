"use client";

import { FilePlusIcon } from "@lib/components/icons";
import { Button } from "@lib/components/ui/button";
import { toast } from "@lib/components/ui/use-toast";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useRouter } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { randomApiKeyName } from "@lib/utils";
import { Paths } from "@lib/constants";

interface NewApiKeyProps {
  isEligible: boolean;
  setOptimisticApiKeys: (action: {
    action: "add" | "delete" | "update";
    apiKey: RouterOutputs["apiKey"]["myApiKeys"][number];
  }) => void;
}

export const NewApiKey = ({ isEligible, setOptimisticApiKeys }: NewApiKeyProps) => {
  const router = useRouter();
  const apiKey = api.apiKey.create.useMutation();
  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const createApiKey = () => {
    if (!isEligible) {
      toast({
        title: (<Link href={Paths.Billing}>Upgrade your plan</Link>) as unknown as string,
        description: "You've reached the limit of api keys for your current plan",
      });
      return;
    }

    startCreateTransaction(async () => {
      await apiKey.mutateAsync(
        {
          name: randomApiKeyName(),
        },
        {
          onSettled: () => {
            setOptimisticApiKeys({
              action: "add",
              apiKey: {
                id: crypto.randomUUID(),
                name: randomApiKeyName(),
                secretKey: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                lastUsedAt: null,
              },
            });
          },
          onSuccess: () => {
            toast({
              title: "Api Key created",
              description: "Your api key has been created successfully",
            });
            router.refresh();
          },
          onError: () => {
            toast({
              title: "An error occurred",
              description: "Please try again",
              variant: "destructive",
            });
          },
        },
      );
    });
  };

  return (
    <Button
      onClick={createApiKey}
      className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50"
      disabled={isCreatePending}
    >
      <div className="flex flex-col items-center gap-4">
        <FilePlusIcon className="h-10 w-10" />
        <p className="text-sm">New Api Key</p>
      </div>
    </Button>
  );
};
