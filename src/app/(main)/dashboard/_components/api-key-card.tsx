"use client";

import { Pencil2Icon, TrashIcon } from "@lib/components/icons";
import { Badge } from "@lib/components/ui/badge";
import { Button } from "@lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lib/components/ui/card";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "@lib/components/ui/use-toast";
import { CopyToClipboard } from "./copy-to-clipboard";
import { Modal } from "@lib/components/ui/modal";
import { ApiKeyEditor } from "./api-key-editor";

interface ApiKeyCardProps {
  apiKey: RouterOutputs["apiKey"]["myApiKeys"][number];
  setOptimisticApiKeys: (action: {
    action: "add" | "delete" | "update";
    apiKey: RouterOutputs["apiKey"]["myApiKeys"][number];
  }) => void;
}

export const ApiKeyCard = ({ apiKey, setOptimisticApiKeys }: ApiKeyCardProps) => {
  const router = useRouter();
  const apiKeyMutation = api.apiKey.delete.useMutation();
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const lastUpdatedAt = apiKey.updatedAt
    ? new Date(apiKey.updatedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
  const handleOnClose = () => {
    setIsOpen(false);
    router.refresh();
  };
  return (
    <>
      <Modal
        title={`Edit ${apiKey.name}`}
        description={`Last update at: ${lastUpdatedAt}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ApiKeyEditor apiKey={apiKey} handleOnClose={handleOnClose} />
      </Modal>
      <Card>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-base">{apiKey.name}</CardTitle>
          <CardDescription className="line-clamp-1 text-sm">
            {"Created At " + new Date(apiKey.createdAt.toJSON()).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="line-clamp-3 text-sm">
          <CopyToClipboard text={apiKey.secretKey} />
        </CardContent>
        <CardFooter className="flex-row-reverse gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil2Icon className="mr-1 h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => {
              startDeleteTransition(async () => {
                await apiKeyMutation.mutateAsync(
                  { id: apiKey.id },
                  {
                    onSettled: () => {
                      setOptimisticApiKeys({
                        action: "delete",
                        apiKey,
                      });
                    },
                    onSuccess: () => {
                      toast({
                        title: "Api Key deleted",
                        description: "Your api key has been deleted successfully",
                      });
                      router.refresh();
                    },
                    onError: () => {
                      toast({
                        title: "An error occurred",
                        description: "Failed to delete the api key",
                        variant: "destructive",
                      });
                    },
                  },
                );
              });
            }}
            disabled={isDeletePending}
          >
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </Button>
          <Badge variant="outline" className="mr-auto rounded-lg capitalize">
            {apiKey.lastUsedAt
              ? new Date(apiKey.lastUsedAt.toJSON()).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : "Never used"}
          </Badge>
        </CardFooter>
      </Card>
    </>
  );
};
