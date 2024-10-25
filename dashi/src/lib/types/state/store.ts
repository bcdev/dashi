import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/lib/types/model/extension";
import type { Contribution } from "@/lib/types/model/contribution";
import type { ApiResult } from "@/lib/utils/fetchApiResult";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ApiOptions } from "@/lib/api";
import type { LoggingOptions } from "@/lib/utils/configureLogging";

export interface HostStore<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  getState: () => T;
  setState: (state: Partial<T>) => void;
}

export interface FrameworkOptions {
  /** The host applications state management store. */
  hostStore?: HostStore;
  /** API options to configure backend. */
  api?: ApiOptions;
  /** Logging options. */
  logging?: LoggingOptions;
}

export interface StoreState {
  /** Framework configuration */
  configuration: FrameworkOptions;
  /** API call result from `GET /contributions`. */
  contributionsResult: ApiResult<Contributions>;
  /** All extensions */
  extensions: Extension[];
  /** A record that maps contribPoint --> Contribution[].*/
  contributionModelsRecord: Record<ContribPoint, Contribution[]>;
  /** A record that maps contribPoint --> ContributionState[].*/
  contributionStatesRecord: Record<ContribPoint, ContributionState[]>;
}
