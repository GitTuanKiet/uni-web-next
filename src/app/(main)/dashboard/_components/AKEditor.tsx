"use client";

import { useRef } from "react";
import { type RouterOutputs } from "@/trpc/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Pencil2Icon,
  LoadingButton
} from "@/components";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { createApiKeySchema } from "@/lib/api/routers/api-key/api-key.input";

interface ApiKeyProps {
  apiKey: RouterOutputs["apiKey"]["myApiKeys"][number];
  handleOnClose: () => void;
}

export const ApiKeyEditor = ({ apiKey, handleOnClose }: ApiKeyProps) => {
  if (!apiKey) return null;
  const formRef = useRef<HTMLFormElement>(null);
  const updateApiKey = api.apiKey.update.useMutation();
  const form = useForm({
    defaultValues: {
      name: apiKey.name,
    },
    resolver: zodResolver(createApiKeySchema),
  });
  const onSubmit = form.handleSubmit(async (values) => {
    await updateApiKey.mutateAsync(
      { id: apiKey.id, ...values },
      {
        onSuccess: () => {
          toast.success("Api Key updated", {
            description: "Your api key has been updated successfully",
          });
        },
        onError: () => {
          toast.error("An error occurred", {
            description: "Failed to update api key",
          });
        },
      },
    );
    handleOnClose();
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <Pencil2Icon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{apiKey.name}</h1>

        <LoadingButton
          disabled={!form.formState.isDirty}
          loading={updateApiKey.isLoading}
          onClick={() => formRef.current?.requestSubmit()}
          className="ml-auto"
        >
          Save
        </LoadingButton>
      </div>
      <div className="h-6"></div>
      <Form {...form}>
        <form ref={formRef} onSubmit={onSubmit} className="block max-w-screen-md space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API KEY NAME</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
