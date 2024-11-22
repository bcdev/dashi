import { isObject } from "@/lib/utils/isObject";

export type ObjPath = (string | number)[];
export type ObjPathLike = ObjPath | string | number | undefined | null;

type Obj = Record<string | number, unknown>;

export function getValue(obj: object | undefined, path: ObjPathLike): unknown {
  path = normalizeObjPath(path);
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

export function setValue<S extends object | undefined>(
  obj: S,
  path: ObjPathLike,
  value: unknown,
): S {
  return _setValue(obj, normalizeObjPath(path), value);
}

function _setValue<S extends object | undefined>(
  obj: S,
  path: ObjPath,
  value: unknown,
): S {
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

export function normalizeObjPath(pathLike: ObjPathLike): ObjPath {
  if (Array.isArray(pathLike)) {
    return pathLike as ObjPath;
  } else if (!pathLike || pathLike === "") {
    return [];
  } else if (typeof pathLike === "number") {
    return [pathLike];
  } else {
    const objPath: ObjPath = pathLike.split(".");
    for (let i = 0; i < objPath.length; i++) {
      const index = Number(objPath[i]);
      if (Number.isInteger(index)) {
        objPath[i] = index;
      }
    }
    return objPath;
  }
}

export function formatObjPath(objPath: ObjPathLike): string {
  if (typeof objPath === "string") {
    return objPath;
  } else if (Array.isArray(objPath)) {
    return objPath
      .map((key) => (typeof key === "number" ? key.toString() : key))
      .join(".");
  } else if (typeof objPath === "number") {
    return objPath.toString();
  }
  return "";
}

export function equalObjPaths(pathLike1: ObjPathLike, pathLike2: ObjPathLike) {
  if (pathLike1 === pathLike2) {
    return true;
  }
  const path1 = normalizeObjPath(pathLike1);
  const path2 = normalizeObjPath(pathLike2);
  return (
    path1.length === path2.length &&
    path1.every((item, index) => item === path2[index])
  );
}
