export interface Callback {
  function: CallbackFunction;
  inputs?: Input[];
  outputs?: Output[];
}

export interface CallbackFunction {
  name: string;
  parameters: CallbackParameter[];
  returnType: string | string[];
}

export interface CallbackParameter {
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
