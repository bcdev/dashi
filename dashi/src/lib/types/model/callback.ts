export interface Callback {
  function: CbFunction;
  inputs?: Input[];
  outputs?: Output[];
}

export interface CbFunction {
  name: string;
  parameters: CbParameter[];
  returnType: string | string[];
}

export interface CbParameter {
  name: string;
  type?: string | string[];
  default?: unknown;
}

export type InputOutputKind = "AppState" | "State" | "Component";

export interface InputOutput {
  /** The kind of input or output. */
  kind: InputOutputKind;
  /**
   * The identifier of a subcomponent.
   * `id` is not needed if kind == "AppState" | "State".
   */
  id?: string;
  // Note, we may allow `property` to be a constant
  // expression of the form: name {"." name | index}
  /**
   * The property of an object or array index.
   * `property` may not be needed if `id` is sufficient.
   */
  property?: string;
}

export interface Input extends InputOutput {}

export interface Output extends InputOutput {}

/**
 * A reference to a specific contribution.
 */
export interface ContribRef {
  // Contribution point name, e.g., "panels"
  contribPoint: string;
  // Contribution index
  contribIndex: number;
}

/**
 * A reference to a specific callback of a contribution.
 */
export interface CallbackRef {
  // The callback index of the contribution
  callbackIndex: number;
  // The input values for the callback that will become server-side
  // function call arguments. They have the same size and order
  // as the callback's inputs.
  inputValues: unknown[];
}

/**
 * A `CallbackRequest` is a request to invoke a server side-side callback.
 * The result from invoking server-side callbacks is a list of `StateChangeRequest`
 * instances.
 */
export interface CallbackRequest extends ContribRef, CallbackRef {}

/**
 * A `StateChangeRequest` is a request to change the application state.
 * Instances of this interface are returned from invoking a server-side callback.
 */
export interface StateChangeRequest extends ContribRef {
  // The stateChanges requested by the contribution
  stateChanges: StateChange[];
}

/**
 * A single state change.
 */
export interface StateChange extends Output {
  value: unknown;
}
