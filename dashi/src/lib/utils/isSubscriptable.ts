export function isSubscriptable(
  value: unknown,
): value is { [key: string]: unknown } {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  );
}
