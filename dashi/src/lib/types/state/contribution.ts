import type { ApiResult } from "@/lib/utils/fetchApiResult";
import type { Contribution } from "@/lib/types/model/contribution";
import type { ComponentState } from "./component";

export interface ContributionState<S extends object = object>
  extends Contribution<S> {
  /**
   * State that is used by the container of this contribution.
   */
  container: S;
  /**
   * The result of loading the initial component tree.
   */
  componentResult: ApiResult<ComponentState>;
  /**
   * The root node of the component tree.
   * The value is initialized from `componentResult.data`
   */
  component?: ComponentState;
}
