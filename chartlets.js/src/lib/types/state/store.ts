import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ApiResult } from "@/lib/types/api";
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
