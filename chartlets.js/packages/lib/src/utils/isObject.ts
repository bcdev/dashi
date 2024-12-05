export function isObject(
  value: unknown,
): value is { [key: string | number]: unknown } {
  return typeof value === "object" && value !== null;
}
