import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LIMITED_REQUEST, INTERVAL_SECONDS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExceptionType = (error: unknown) => {
  const UnknownException = {
    type: "UnknownException",
    status: 500,
    message: "An unknown error occurred",
  };

  if (!error) return UnknownException;

  if ((error as Record<string, unknown>).name === "DatabaseError") {
    return {
      type: "DatabaseException",
      status: 400,
      message: "Duplicate key entry",
    };
  }

  return UnknownException;
};

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
  }).format(new Date(date));
}

export function formatPrice(price: number | string, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "USD",
    notation: options.notation ?? "compact",
    ...options,
  }).format(Number(price));
}

export function absoluteUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).href;
}

export function randomApiKeyName() {
  return `API Key ${Math.floor(Math.random() * 1000)}`;
}

export function filterNullish<T>(obj: T): T {
  return Object.fromEntries(Object.entries((obj as object)).filter(([_, v]) => v != null)) as T;
}

export class RateLimit {
  private limit: number;
  private tokens: number;
  private nextRefill: number;
  private interval: number;
  private listCheck: Record<string, { rateLimit: RateLimit; lastRequest: number }>;
  private cleanupInterval: NodeJS.Timeout;

  constructor(limit = LIMITED_REQUEST, intervalSeconds = INTERVAL_SECONDS) {
    this.limit = limit;
    this.tokens = limit;
    this.nextRefill = Date.now() + intervalSeconds * 1000;
    this.interval = intervalSeconds * 1000;
    this.listCheck = {};
    this.cleanupInterval = this.initInterval(this.interval * 2);
  }

  private initInterval(time: number) {
    if (!this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const key in this.listCheck) {
          if (now - (this.listCheck[key]?.lastRequest ?? 0) > time) {
            delete this.listCheck[key];
          }
        }
      }, time) as NodeJS.Timeout;
    }

    return this.cleanupInterval;
  }

  private refill() {
    const now = Date.now();
    if (now >= this.nextRefill) {
      this.tokens = this.limit;
      this.nextRefill = now + this.interval;
    }
  }

  canRequest() {
    try {
      this.refill();
      if (this.tokens > 0) {
        this.tokens--;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error while checking request:", error);
      return false;
    }
  }

  canRequestKey(key: string) {
    if (!this.listCheck[key]) {
      this.listCheck[key] = { rateLimit: new RateLimit(), lastRequest: Date.now() };
    } else {
      this.listCheck[key] = {
        rateLimit: new RateLimit(),
        lastRequest: Date.now(),
        ...filterNullish(this.listCheck[key]),
      };
    }
    return this.listCheck[key]?.rateLimit.canRequest();
  }

  reset() {
    this.tokens = this.limit;
    this.nextRefill = Date.now();
    this.listCheck = {};
    clearInterval(this.cleanupInterval);
    this.initInterval(this.interval);
  }

  resetKey(key: string) {
    if (this.listCheck[key]) {
      this.listCheck[key]?.rateLimit.reset();
    }
  }

  getRemaining() {
    this.refill();
    return this.tokens;
  }

  getRemainingKey(key: string) {
    if (this.listCheck[key]) {
      return this.listCheck[key]?.rateLimit.getRemaining();
    }
    return 0;
  }

  getResetTime() {
    this.refill();
    return Math.max(0, this.nextRefill - Date.now());
  }

  getResetTimeKey(key: string) {
    if (this.listCheck[key]) {
      return this.listCheck[key]?.rateLimit.getResetTime();
    }
    return 0;
  }
}