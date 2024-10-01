export interface Callback {
  function: string;
  inputs?: Input[];
  outputs?: Output[];
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
  contribPoint: string;
  contribIndex: number;
  callbackIndex: number;
  inputValues: unknown[];
}

export interface CallbackCallResult {
  contribPoint: string;
  contribIndex: number;
  computedOutputs: ComputedOutput[];
}

export interface ComputedOutput extends Output {
  value: unknown;
}
