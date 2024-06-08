//==================================================
//    LIBRARY: Shared Utilities
//==================================================

//==================================================
//          FUNCTION: filterNullish
//==================================================
// filters nullish values from an object
export function filterNullish<T>(obj: T): T {
  return Object.fromEntries(Object.entries(obj as object).filter(([_, v]) => v != null)) as T;
}
