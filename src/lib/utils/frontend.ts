//====================================================
//    LIBRARY: Frontend Utilities
//====================================================

import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//====================================================
//          FUNCTION: cn
//====================================================
// Function to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//====================================================
//          FUNCTION: getExceptionType
//====================================================
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

//====================================================
//          FUNCTION: formatDate
//====================================================
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

//====================================================
//          FUNCTION: formatPrice
//====================================================
export function formatPrice(price: number | string, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "USD",
    notation: options.notation ?? "compact",
    ...options,
  }).format(Number(price));
}

//====================================================
//          FUNCTION: absoluteUrl
//====================================================
export function absoluteUrl(path: string) {
  return new URL(prefixPath(path), env.NEXT_PUBLIC_APP_URL).href;
}

//====================================================
//          FUNCTION: randomApiKeyName
//====================================================
export function randomApiKeyName() {
  return `API Key ${Math.floor(Math.random() * 1000)}`;
}

//====================================================
//          FUNCTION: prefixPath
//====================================================
export function prefixPath(path: string) {
  return `${env.NEXT_PUBLIC_PREFIX}${path}`;
}

//====================================================
//          FUNCTION: fetcher
//====================================================
export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json() as { error: string };
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json() as Promise<T>;
}