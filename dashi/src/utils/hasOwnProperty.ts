export function hasOwnProperty(obj: unknown, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}
