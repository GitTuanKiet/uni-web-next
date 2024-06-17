import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  boolean,
  index,
  text,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { DATABASE_PREFIX as prefix } from "@/lib/constants";

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);

export const emailVerificationCodes = pgTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("verification_code_user_idx").on(t.userId),
    emailIdx: index("verification_code_email_idx").on(t.email),
  }),
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (t) => ({
    userIdx: index("password_token_user_idx").on(t.userId),
  }),
);

export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
    stripePriceId: varchar("stripe_price_id", { length: 191 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  },
  (t) => ({
    userIdx: index("customer_user_idx").on(t.userId),
    // stripeCustomerIdx: index("customer_stripe_customer_id_idx").on(t.stripeCustomerId),
  }),
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export const payers = pgTable(
  "payers",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
    paypalPlanId: varchar("paypal_plan_id", { length: 255 }),
    paypalPayerId: varchar("paypal_payer_id", { length: 255 }),
    paypalCurrentPeriodEnd: timestamp("paypal_current_period_end"),
  },
  (t) => ({
    userIdx: index("payer_user_idx").on(t.userId),
    // emailIdx: index("payer_email_idx").on(t.email),
    // paypalPayerIdx: index("payer_paypal_payer_id_idx").on(t.paypalPayerId),
  }),
);

export type Payer = typeof payers.$inferSelect;
export type NewPayer = typeof payers.$inferInsert;

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    providerId: varchar("provider", {
      length: 11,
      enum: ["discord", "google", "credentials"],
    }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  },
  (t) => ({
    userIdx: index("account_user_idx").on(t.userId),
    providerIdIdx: index("account_provider_id_idx").on(t.providerId),
    providerAccountIdIdx: index("account_provider_account_id_idx").on(t.providerAccountId),
  }),
);

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export const profiles = pgTable(
  "profiles",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    userIdx: index("profile_user_idx").on(t.userId),
  }),
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    avatar: varchar("avatar", { length: 255 }),
    hashedPassword: text("hashed_password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: index("user_email_idx").on(t.email),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const apiKeys = pgTable(
  "api_keys",
  {
    id: varchar("id", { length: 21 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    secretKey: varchar("secret_key", { length: 255 }).unique().notNull(),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => ({
    userIdx: index("api_key_user_idx").on(t.userId),
    keyIdx: index("api_key_secret_key_idx").on(t.secretKey),
  }),
);

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export const usageLogs = pgTable(
  "usage_logs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    apiKey: varchar("secret_key", { length: 255 }).notNull(),
    method: varchar("method", { length: 10 }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    query: jsonb("query"),
    body: jsonb("body"),
    response: jsonb("response"),
    status: varchar("status", { length: 3 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    apiKey: index("usage_api_key_idx").on(t.apiKey),
    userIdx: index("usage_user_id_idx").on(t.userId),
  }),
);

export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  customer: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
  payer: one(payers, {
    fields: [users.id],
    references: [payers.userId],
  }),
  accounts: many(accounts),
  apiKeys: many(apiKeys),
  usageLogs: many(usageLogs),
}));

export const accountRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  usageLog: many(usageLogs),
}));

export const apiKeyRelations = relations(apiKeys, ({ one, many }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  usageLogs: many(usageLogs),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const customerRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const payerRelations = relations(payers, ({ one }) => ({
  user: one(users, {
    fields: [payers.userId],
    references: [users.id],
  }),
}));

export const usageLogRelations = relations(usageLogs, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [usageLogs.apiKey],
    references: [apiKeys.secretKey],
  }),
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [usageLogs.userId],
    references: [accounts.userId],
  }),
}));
