import type { TopLevelParameter } from "vega-lite/src/spec/toplevel";
import type { TopLevelSelectionParameter } from "vega-lite/src/selection";

export type SignalHandler = (signalName: string, value: unknown) => void;

/*
 There are two types of Parameters in Vega-lite. Variable and Selection parameters. We need to check if the provided
 parameter in the chart from the server is a Selection parameter so that we can extract the selection event types
 (point or interval) and further, the events from the `select.on` property (e.g. click, mouseover, keydown etc.) if
 that property `on` exists. We need these events and their names to create the signal listeners and pass them to the
 Vega-lite element for event-handling (signal-listeners).
 */
export function isTopLevelSelectionParameter(
  param: TopLevelParameter,
): param is TopLevelSelectionParameter {
  return "select" in param;
}
