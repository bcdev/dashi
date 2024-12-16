export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Record<string, unknown>)["then"] === "function"
  );
}
