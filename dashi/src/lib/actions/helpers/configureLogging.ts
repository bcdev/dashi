import diff, { type Difference } from "microdiff";

import { store } from "@/lib/store";
import { type StoreState } from "@/lib/types/state/store";

const indexStyle = "color:light-dark(lightblue, lightblue)";
const typeStyle = "font-weight:bold";
const pathStyle = "color:light-dark(darkgrey, lightgray)";

let unsubscribe: (() => void) | undefined = undefined;

export interface LoggingOptions {
  enabled?: boolean;
}

export function configureLogging(options?: LoggingOptions) {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = undefined;
  }
  if (!options || options.enabled) {
    unsubscribe = store.subscribe(logState);
  }
}

function logState(next: StoreState, prev: StoreState) {
  const delta = diff(prev, next);
  const nDiffs = delta.length;
  console.groupCollapsed(
    `chartlets: state changed (${nDiffs} difference${nDiffs === 1 ? "" : "s"})`,
  );
  delta.forEach(logDiff);
  console.debug("chartlets: change details:", { prev, next, delta });
  console.groupEnd();
}

function logDiff(v: Difference, index: number) {
  const wherePart = `%c${index + 1} %c${v.type} %c${v.path.join(".")}`;
  if (v.type === "CREATE") {
    console.debug("chartlets:", wherePart, indexStyle, typeStyle, pathStyle, {
      value: v.value,
    });
  } else if (v.type === "CHANGE") {
    console.debug("chartlets:", wherePart, indexStyle, typeStyle, pathStyle, {
      value: v.value,
      oldValue: v.oldValue,
    });
  } else if (v.type === "REMOVE") {
    console.debug("chartlets:", wherePart, indexStyle, typeStyle, pathStyle, {
      oldValue: v.oldValue,
    });
  }
}
