import { createTRPCRouter, protectedProcedure } from "@lib/api/trpc";
import * as inputs from "./api-key.input";
import * as services from "./api-key.service";

export const apiKeyRouter = createTRPCRouter({
  get: protectedProcedure
    .input(inputs.getApiKeySchema)
    .query(({ ctx, input }) => services.getApiKey(ctx, input)),

  create: protectedProcedure
    .input(inputs.createApiKeySchema)
    .mutation(({ ctx, input }) => services.createApiKey(ctx, input)),

  update: protectedProcedure
    .input(inputs.updateApiKeySchema)
    .mutation(({ ctx, input }) => services.updateApiKey(ctx, input)),

  delete: protectedProcedure
    .input(inputs.deleteApiKeySchema)
    .mutation(async ({ ctx, input }) => services.deleteApiKey(ctx, input)),

  myApiKeys: protectedProcedure
    .input(inputs.myApiKeysSchema)
    .query(({ ctx, input }) => services.myApiKeys(ctx, input)),
});
