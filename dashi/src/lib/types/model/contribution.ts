import { type Callback } from "./callback";

export interface Contribution<S extends object = object> {
  name: string;
  extension: string;
  layout?: Callback;
  callbacks?: Callback[];
  initialState?: S;
}
