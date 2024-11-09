export type ObjPath = (string | number)[];

export function getValue(obj: object, path: ObjPath): unknown {
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

export function setValue<S extends object>(
  obj: S,
  path: ObjPath | string,
  value: unknown,
): S | undefined {
  return _setValue(obj, toObjPath(path), value);
}

export function _setValue<S extends object>(
  obj: S,
  path: ObjPath,
  value: unknown,
): S | undefined {
  if (path.length === 1) {
    const key = path[0];
    if (typeof obj === "object") {
      const oldValue = obj[key];
      if (value === oldValue) {
        return obj;
      }
      const newObj = Array.isArray(obj)
        ? ([...obj] as unknown[])
        : ({ ...obj } as Record<string, unknown>);
      newObj[key] = value;
      return newObj as S;
    } else if (obj === undefined) {
      const newObj =
        typeof key === "number"
          ? ([] as unknown[])
          : ({} as Record<string, unknown>);
      newObj[key] = value;
      return newObj as S;
    }
  } else if (path.length > 1) {
    if (typeof obj === "object") {
      const key = path[0];
      const subObj = obj[key];
      const newSubObj = setValue(subObj, path.slice(1), value);
      if (subObj !== newSubObj) {
        const newObj = Array.isArray(obj)
          ? ([...obj] as unknown[])
          : ({ ...obj } as Record<string, unknown>);
        newObj[key] = newSubObj;
        return newObj as S;
      }
    }
  }
  return obj;
}

function toObjPath(property: ObjPath | string): ObjPath {
  if (Array.isArray(property)) {
    return property as ObjPath;
  }
  if (property === "") {
    return [];
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
