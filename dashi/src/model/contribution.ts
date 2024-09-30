import { Callback } from "./callback";

export interface ContributionModel {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
}
