/**
 * Normalizes a CSV value by removing the leading "\r" from the
 * value.
 */
export function normalizeCSVValue<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\\r$/, "").trim() as T
  }
  return value
}
