import { create } from 'zustand/index';
import diff, { Difference } from 'microdiff';
import { SystemState } from '../state/system';

const systemStore = create<SystemState>(() => ({
    contributionsResult: {},
    extensions: [],
    contributionModelsRecord: {},
    contributionStatesRecord: {},
}));

export default systemStore;

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

    systemStore.subscribe((next, prev) => {
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
