import { type ApiResult } from "@/lib/utils/fetchApiResult";
import { type ComponentState } from "./component";

export interface ContributionState {
  title?: string;
  visible?: boolean;
  componentStateResult: ApiResult<ComponentState>;
  // componentStateResult.data
  componentState?: ComponentState;
}
