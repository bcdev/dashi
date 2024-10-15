import {
  type ContribPoint,
  type Contributions,
  type Extension,
} from "@/lib/types/model/extension";
import { type Contribution } from "@/lib/types/model/contribution";
import { type ApiResult } from "@/lib/utils/fetchApiResult";
import { type ContributionState } from "@/lib/types/state/contribution";
import { type ApiOptions } from "@/lib/api";

export interface StoreState {
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
