import { ComponentModel } from "./component.ts";

export interface Extension {
  name: string;
  version: string;
  contributes: string[];
}

export interface ContributionModel {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
}

export type InputOutputKind = "AppState" | "State" | "Component";

export interface InputOutput {
  id?: string;
  property?: string;
  kind?: InputOutputKind;
}

export interface Input extends InputOutput {}

export interface Output extends InputOutput {}

export interface Callback {
  function: string;
  inputs?: Input[];
  outputs?: Output[];
}
