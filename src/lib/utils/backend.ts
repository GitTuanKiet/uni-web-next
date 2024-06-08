//====================================================
//    LIBRARY: Backend Utilities
//====================================================

import { LIMITED_REQUEST, INTERVAL_SECONDS } from "../constants";
import { filterNullish } from "./shared";

//====================================================
//          CLASS: RateLimit
//====================================================
// RateLimit class to limit the number of requests
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
