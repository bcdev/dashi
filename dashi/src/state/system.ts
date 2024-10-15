import { ContribPoint, Contributions, Extension } from "@/model/extension";
import { Contribution } from "@/model/contribution";
import { ApiResult } from "@/utils/fetchApiResult";
import { ContributionState } from "./contribution";
import { ApiOptions } from "@/api";

export interface SystemState {
  apiOptions?: ApiOptions;
  // API call result GET /contributions
  contributionsResult: ApiResult<Contributions>;
  // All extensions
  extensions: Extension[];
  // A record that maps contribPoint --> Contribution[]
  contributionModelsRecord: Record<ContribPoint, Contribution[]>;
  // A record that maps contribPoint --> ContributionState[]
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}
