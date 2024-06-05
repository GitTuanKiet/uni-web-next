import { defineConfig } from "drizzle-kit";
import { DATABASE_PREFIX } from "@lib/constants";

export default defineConfig({
  schema: "./drizzle/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  tablesFilter: [`${DATABASE_PREFIX}_*`],
});
