//==================================================
//    LIBRARY: Shared Utilities
//==================================================

import { customAlphabet } from "nanoid";

//==================================================
//          CONSTANT: nanoid
//==================================================
// 7-character random string
export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
)

//==================================================
//          FUNCTION: filterNullish
//==================================================
export function filterNullish<T>(obj: T): T {
  return Object.fromEntries(Object.entries(obj as object).filter(([_, v]) => v != null)) as T;
}

//====================================================
//          FUNCTION: runAsyncFnWithoutBlocking
//====================================================
export const runAsyncFnWithoutBlocking = (fn: (...args: unknown[]) => Promise<void>) => {
  void fn();
};

//====================================================
//          FUNCTION: sleep
//====================================================
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//====================================================
//          FUNCTION: getStringFromBuffer
//====================================================
export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");