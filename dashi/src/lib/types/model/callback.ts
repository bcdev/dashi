import type { Input, Output } from "@/lib/types/model/channel";

export interface Callback {
  function: CbFunction;
  inputs?: Input[];
  outputs?: Output[];
}

export type JsonTypeName =
  | "null"
  | "boolean"
  | "integer"
  | "number"
  | "string"
  | "object"
  | "array";

export interface JsonSchema {
  type?: JsonTypeName | JsonTypeName[];
  [property: string]: unknown;
}

export interface CbFunction {
  name: string;
  parameters: CbParameter[];
  returnType: JsonSchema;
}

export interface CbParameter {
  name: string;
  type?: JsonSchema;
  default?: unknown;
}

/**
 * A reference to a specific contribution.
 */
export interface ContribRef {
  /**
   * Name of the contribution point, e.g., "panels".
   */
  contribPoint: string;
  /**
   * Index into the contributions of a contribution point.
   */
  contribIndex: number;
}

/**
 * A reference to a specific callback of a contribution.
 */
export interface CallbackRef {
  /**
   * The callback index of the contribution.
   */
  callbackIndex: number;
}

/**
 * A reference to a specific input of a callback.
 */
export interface InputRef {
  /**
   * The index of the input of a callback.
   * Used to store the input that triggered the callback.
   */
  inputIndex: number;
}

/**
 * A `CallbackRequest` is a request to invoke a server-side callback.
 * The result from invoking server-side callbacks is a list of `StateChangeRequest`
 * instances.
 */
export interface CallbackRequest extends ContribRef, CallbackRef, InputRef {
  /**
   * The input values for the callback that will become server-side
   * function call arguments. They have the same size and order
   * as the callback's inputs.
   */
  inputValues: unknown[];
}

/**
 * A `StateChangeRequest` is a request to change the application state.
 * Instances of this interface are returned from invoking a server-side callback.
 */
export interface StateChangeRequest extends ContribRef {
  /**
   * The stateChanges requested by the contribution.
   */
  stateChanges: StateChange[];
}

/**
 * A single state change.
 */
export interface StateChange extends Output {
  value: unknown;
}
