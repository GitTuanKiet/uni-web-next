import { db } from "@drizzle/db";
import { type ApiKey } from "@drizzle/db/schema";
import { RateLimit } from "@/lib/utils";

class UsageKey {
  private readonly rateLimit: RateLimit;

  constructor() {
    this.rateLimit = new RateLimit();
  }

  async validateRequest(secretKey: string): Promise<
  { apiKey: ApiKey | null, error: string | null }
  > {
    if (!this.rateLimit.canRequestKey(secretKey)) {
      return {
        apiKey: null,
        error: `Rate limit exceeded. Please wait ${this.rateLimit.getResetTimeKey(secretKey)}ms before trying again`,
      };
    }

    const existingApiKey = await db.query.apiKeys.findFirst({
      where: (table, { eq }) => eq(table.secretKey, secretKey),
    });

    if (!existingApiKey) {
      return { 
        apiKey: null,
        error: "Invalid API key",
      };
    }

    return {
      apiKey: existingApiKey,
      error: null
    };
  }
}

export const usageKey = new UsageKey();