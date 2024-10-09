import { ApiResult } from "../utils/fetchApiResult";
import { ComponentState } from "./component";

export interface ContributionState {
  title?: string;
  visible?: boolean;
  componentStateResult: ApiResult<ComponentState>;
  // componentStateResult.data
  componentState?: ComponentState;
}
