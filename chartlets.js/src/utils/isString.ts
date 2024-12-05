export function isString(signalName: unknown): signalName is string {
  return typeof signalName === "string";
}
