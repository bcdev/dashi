export type ContribPoint = string;

export interface Extension {
  name: string;
  version: string;
  contributes: ContribPoint[];
}
