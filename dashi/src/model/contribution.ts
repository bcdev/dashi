import { Callback } from "./callback.ts";

export interface ContributionModel {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
}
