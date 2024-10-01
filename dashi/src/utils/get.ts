/**
 * Get value from `obj` at `path`.
 *
 * For example
 * ```
 * > get({a: {b: [13, 14, 15]}}, "a.b.1")
 * < 14
 * ```
 *
 * @param obj and object or array
 * @param path a property path with dot `.` as separator.
 * @returns value from `obj` at `path`
 */
export function get<T extends object | unknown[]>(
  obj: T,
  path: string,
): unknown {
  let result = obj;
  path.split(".").forEach((key) => {
    result = result[key];
  });
  return result;
}
