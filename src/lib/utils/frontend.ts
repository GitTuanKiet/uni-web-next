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
// Function to get the type of exception
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
// Function to format date
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

//====================================================
//          FUNCTION: absoluteUrl
//====================================================
// Function to get absolute URL
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
// Function to prefix path
export function prefixPath(path: string) {
  return `${env.NEXT_PUBLIC_PREFIX}${path}`;
}