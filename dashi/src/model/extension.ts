import { Contribution } from "./contribution";

export type ContribPoint = string;

export interface Contributions {
  extensions: Extension[];
  contributions: Record<ContribPoint, Contribution[]>;
}

export interface Extension {
  name: string;
  version: string;
  contributes: ContribPoint[];
}
