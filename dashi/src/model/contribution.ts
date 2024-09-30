import { Callback } from "./callback";

export interface Contribution {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
}
