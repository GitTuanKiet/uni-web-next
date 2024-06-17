import { defineConfig } from "drizzle-kit";
import { DATABASE_PREFIX } from "@/lib/constants";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/db/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [`${DATABASE_PREFIX}_*`],
  migrations: {
    table: 'migrations',
    schema: "public",
  },
});
