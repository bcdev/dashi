/**
 * Set value of `obj` at `path`.
 *
 * For example
 * ```
 * > set({a: {b: [13, 14, 15]}}, "a.b.1", -1)
 * < {a: {b: [13, -1, 15]}}
 * ```
 *
 * The function does not create new object instances,
 * but modifies the `obj` in place.
 * The intended use is with `immer`, pass the _draft_ object of
 * `produce`, i.e.,
 *
 * ```
 * obj = produce(draft => {
 *   set(draft, ...)
 * })
 * ```
 *
 * @param obj and object or array.
 * @param path a property path with dot `.` as separator.
 * @param value a value to set.
 * @returns the `obj` to allow for nested `set()` calls.
 */
export function set<T extends object | unknown[]>(
  obj: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const lastIndex = keys.length - 1;
  let lastObj = obj;
  keys.forEach((key, index: number) => {
    if (index === lastIndex) {
      lastObj[key] = value;
    } else {
      lastObj = lastObj[key];
    }
  });
  return obj;
}
