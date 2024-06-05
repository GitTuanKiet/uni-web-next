import { z } from "zod";

export const getApiKeySchema = z.object({
  id: z.string(),
});
export type GetApiKeyInput = z.infer<typeof getApiKeySchema>;

export const createApiKeySchema = z.object({
  name: z.string().min(3).max(255),
});
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

export const updateApiKeySchema = createApiKeySchema.extend({
  id: z.string(),
});
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;

export const deleteApiKeySchema = z.object({
  id: z.string(),
});
export type DeleteApiKeyInput = z.infer<typeof deleteApiKeySchema>;

export const myApiKeysSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type MyApiKeysInput = z.infer<typeof myApiKeysSchema>;
