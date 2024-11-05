export function getValue(obj: object, path: (string | number)[]): unknown {
  let value: unknown = obj;
  for (const key of path) {
    if (typeof value === "object") {
      value = (value as unknown as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return value;
}
