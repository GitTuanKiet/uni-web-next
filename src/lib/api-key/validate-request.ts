import { cache } from "react";
import { headers } from "next/headers";
import type { ApiKey } from "@drizzle/db/schema";
import { usageKey } from ".";

export const uncachedValidateRequest = async (): Promise<
  { apiKey: ApiKey | null, error?: string }
> => {
  try {
    const secretKey = headers().get("x-api-key");
    if (!secretKey) {
      throw new Error("No API key provided");
    }

    const { apiKey, error } = await usageKey.validateRequest(secretKey);

    if (!apiKey) {
      throw new Error(error!);
    }

    return { apiKey };
  } catch (error) {
    return { apiKey: null, error: (error as Error).message };
  }
};

export const validateRequest = cache(uncachedValidateRequest);
