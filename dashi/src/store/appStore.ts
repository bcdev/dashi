import { create } from "zustand";
import diff, { Difference } from "microdiff";

import { ContribPoint, Contributions, Extension } from "../model/extension";
import { Contribution } from "../model/contribution";
import { ContributionState } from "../state/contribution";
import { ApiResult } from "../utils/fetchApiResult";

export interface AppState {
  // API call result /dashi/contributions
  contributionsResult: ApiResult<Contributions>;
  // All extensions
  extensions: Extension[];
  // A record that maps contribPoint --> Contribution[]
  contributionModelsRecord: Record<ContribPoint, Contribution[]>;
  // A record that maps contribPoint --> ContributionState[]
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}

const appStore = create<AppState>(() => ({
  contributionsResult: {},
  extensions: [],
  contributionModelsRecord: {},
  contributionStatesRecord: {},
}));

export default appStore;

if (import.meta.env.DEV) {
  const indexStyle = "color:light-dark(lightblue, lightblue)";
  const typeStyle = "font-weight:bold";
  const pathStyle = "color:light-dark(darkgrey, lightgray)";

  const logDiff = (v: Difference, index: number) => {
    const wherePart = `%c${index + 1} %c${v.type} %c${v.path.join(".")}`;
    if (v.type === "CREATE") {
      console.log(wherePart, indexStyle, typeStyle, pathStyle, {
        value: v.value,
      });
    } else if (v.type === "CHANGE") {
      console.log(wherePart, indexStyle, typeStyle, pathStyle, {
        value: v.value,
        oldValue: v.oldValue,
      });
    } else if (v.type === "REMOVE") {
      console.log(wherePart, indexStyle, typeStyle, pathStyle, {
        oldValue: v.oldValue,
      });
    }
  };

  appStore.subscribe((next, prev) => {
    const delta = diff(prev, next);
    const nDiffs = delta.length;
    console.groupCollapsed(
      `state changed (${nDiffs} difference${nDiffs === 1 ? "" : "s"})`,
    );
    delta.forEach(logDiff);
    console.debug("Details:", { prev, next, delta });
    console.groupEnd();
  });
}
