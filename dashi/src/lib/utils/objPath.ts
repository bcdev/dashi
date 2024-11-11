import { isObject } from "@/lib/utils/isObject";

export type ObjPath = (string | number)[];

type Obj = Record<string | number, unknown>;

export function getValue(obj: object, path: ObjPath): unknown {
  let value: unknown = obj;
  for (const key of path) {
    if (isObject(value)) {
      value = (value as Obj)[key];
    } else {
      return undefined;
    }
  }
  return value;
}

export function setValue<S extends object>(
  obj: S,
  path: ObjPath | string,
  value: unknown,
): S | undefined {
  return _setValue(obj, toObjPath(path), value);
}

export function _setValue<S extends object>(
  obj: S | undefined,
  path: ObjPath,
  value: unknown,
): S | undefined {
  if (path.length === 1) {
    const key = path[0];
    if (isObject(obj)) {
      const oldValue = obj[key];
      if (value === oldValue) {
        return obj;
      }
      const newObj = (Array.isArray(obj) ? [...obj] : { ...obj }) as Obj;
      newObj[key] = value;
      return newObj as S;
    } else if (obj === undefined) {
      const newObj = (typeof key === "number" ? [] : {}) as Obj;
      newObj[key] = value;
      return newObj as S;
    }
  } else if (path.length > 1) {
    if (isObject(obj)) {
      const key = path[0];
      const subObj = obj[key];
      if (isObject(subObj) || subObj === undefined) {
        const newSubObj = _setValue(subObj, path.slice(1), value);
        if (subObj !== newSubObj) {
          const newObj = (Array.isArray(obj) ? [...obj] : { ...obj }) as Obj;
          newObj[key] = newSubObj;
          return newObj as S;
        }
      }
    }
  }
  return obj;
}

export function toObjPath(
  property: ObjPath | string | number | undefined | null,
): ObjPath {
  if (Array.isArray(property)) {
    return property as ObjPath;
  }
  if (property === "" || !property) {
    return [];
  }
  if (typeof property === "number") {
    return [property];
  }
  const objPath: ObjPath = property.split(".");
  for (let i = 0; i < objPath.length; i++) {
    const index = Number(objPath[i]);
    if (Number.isInteger(index)) {
      objPath[i] = index;
    }
  }
  return objPath;
}
