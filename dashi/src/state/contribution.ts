import { ApiResult } from "../utils/fetchApiResult";
import { ComponentState } from "./component";

export interface ContributionState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentState>;
  componentState?: ComponentState;
}
