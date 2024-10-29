import type { ApiResult } from "@/lib/utils/fetchApiResult";
import type { Contribution } from "@/lib/types/model/contribution";
import type { ComponentState } from "./component";

export interface ContributionState<S extends object = object>
  extends Contribution<S> {
  state: S;
  componentStateResult: ApiResult<ComponentState>;
  // The value of componentStateResult.data, once it is available
  componentState?: ComponentState;
}
