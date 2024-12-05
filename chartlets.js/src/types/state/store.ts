import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/types/model/extension";
import type { ContributionState } from "@/types/state/contribution";
import type { ApiResult } from "@/types/api";
import type { FrameworkOptions } from "./options";

export interface StoreState {
  /** Framework configuration */
  configuration: FrameworkOptions;
  /** All extensions */
  extensions: Extension[];
  /** API call result from `GET /contributions`. */
  contributionsResult: ApiResult<Contributions>;
  /** A record that maps contribPoint --> ContributionState[].*/
  contributionsRecord: Record<ContribPoint, ContributionState[]>;
}
