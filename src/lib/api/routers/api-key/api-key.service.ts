import { generateId } from "lucia";
import type { ProtectedTRPCContext } from "@/lib/api/trpc";
import type {
  CreateApiKeyInput,
  DeleteApiKeyInput,
  GetApiKeyInput,
  MyApiKeysInput,
  UpdateApiKeyInput,
} from "./api-key.input";
import { apiKeys } from "@drizzle/db/schema";
import { eq } from "drizzle-orm";

export const getApiKey = async (ctx: ProtectedTRPCContext, { id }: GetApiKeyInput) => {
  return ctx.db.query.apiKeys.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: { user: { columns: { email: true } } },
  });
};

export const createApiKey = async (ctx: ProtectedTRPCContext, input: CreateApiKeyInput) => {
  const id = generateId(15);
  const secretKey = generateId(32);

  await ctx.db.insert(apiKeys).values({
    id,
    userId: ctx.user.id,
    name: input.name,
    secretKey,
  });

  return { id };
};

export const updateApiKey = async (ctx: ProtectedTRPCContext, input: UpdateApiKeyInput) => {
  const [item] = await ctx.db
    .update(apiKeys)
    .set({
      name: input.name,
    })
    .where(eq(apiKeys.id, input.id))
    .returning();

  return item;
};

export const deleteApiKey = async (ctx: ProtectedTRPCContext, { id }: DeleteApiKeyInput) => {
  const [item] = await ctx.db.delete(apiKeys).where(eq(apiKeys.id, id)).returning();
  return item;
};

export const myApiKeys = async (ctx: ProtectedTRPCContext, input: MyApiKeysInput) => {
  return ctx.db.query.apiKeys.findMany({
    where: (table, { eq }) => eq(table.userId, ctx.user.id),
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      name: true,
      secretKey: true,
      lastUsedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
