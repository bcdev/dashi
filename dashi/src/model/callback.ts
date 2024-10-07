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
  kind: InputOutputKind;
  id: string;
  property: string;
}

export interface Input extends InputOutput {}

export interface Output extends InputOutput {}

export interface CallbackCallRequest {
  // The contribution that requests the callback call
  contribPoint: string;
  contribIndex: number;
  // The callback of the contribution
  callbackIndex: number;
  // The input values for the callback
  inputValues: unknown[];
}

export interface ChangeRequest {
  // The contribution that requests the changes
  contribPoint: string;
  contribIndex: number;
  // The changes requested by the contribution
  changes: Change[];
}

export interface Change extends Output {
  value: unknown;
}
