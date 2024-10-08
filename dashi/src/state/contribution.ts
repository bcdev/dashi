import { ApiResult } from "../utils/fetchApiResult";
import { ComponentModel } from "../model/component";

export type ContribPoint = string;

export interface ContributionState {
  visible?: boolean;
  componentModelResult: ApiResult<ComponentModel>;
  componentState?: ComponentModel;
}
