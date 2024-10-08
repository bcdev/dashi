import { Callback } from "./callback";

export interface Contribution {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
  // The following properties will become the
  // initial contribution state
  title?: string;
  visible?: boolean;
}
