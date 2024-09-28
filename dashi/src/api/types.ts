import { Output } from "../model/extension.ts";

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
