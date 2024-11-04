import { store } from "@/lib/store";
import type { ContribRef, Input } from "@/lib/types/model/callback";

interface InputRef extends ContribRef {
  // The callback index of the contribution
  callbackIndex: number;
  // The index of an input
  inputIndex: number;
  // The property path
  propertyPath: string[];
}

// TODO: use memo
function getHostStoreInputRefs(): InputRef[] {
  const { contributionsRecord } = store.getState();
  const appStateRefs: InputRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (input.kind === "AppState" && input.property) {
              appStateRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                propertyPath: input.property.split("."),
              });
            }
          }),
        [] as Input[],
      );
    });
  });
  return appStateRefs;
}

export function handleHostStoreChange<S extends object = object>(
  currState: S,
  prevState: S,
) {
  const effectiveInputRefs = getHostStoreInputRefs().filter((inputRef) =>
    isEffectiveInputRef(inputRef, currState, prevState),
  );
  if (effectiveInputRefs.length === 0) {
    return;
  }
}

function isEffectiveInputRef<S extends object = object>(
  inputRef: InputRef,
  currState: S,
  prevState: S,
): boolean {
  const propertyPath = inputRef.propertyPath;
  const currValue = get(currState, propertyPath);
  const prevValue = get(prevState, propertyPath);
  return !Object.is(currValue, prevValue);
}

function get(obj: object, path: (string | number)[]): unknown {
  let value: unknown = obj;
  for (let key of path) {
    if (typeof value === "object") {
      value = (value as object)[key];
    } else {
      return undefined;
    }
  }
  return value;
}
