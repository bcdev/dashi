import type { StoreApi } from "zustand";

import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/lib/types/model/extension";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { ApiOptions, ApiResult } from "@/lib/types/api";
import type { LoggingOptions } from "@/lib/actions/helpers/configureLogging";

export interface FrameworkOptions<S extends object = object> {
  /** The host applications state management store. */
  hostStore?: StoreApi<S>;
  /** Get a derived state from given host state. */
  getDerivedHostState?: <S>(hostState: S, propertyName: string) => unknown;
  /** API options to configure backend. */
  api?: ApiOptions;
  /** Logging options. */
  logging?: LoggingOptions;
}

export interface StoreState<S extends object = object> {
  /** Framework configuration */
  configuration: FrameworkOptions<S>;
  /** All extensions */
  extensions: Extension[];
  /** API call result from `GET /contributions`. */
  contributionsResult: ApiResult<Contributions>;
  /** A record that maps contribPoint --> ContributionState[].*/
  contributionsRecord: Record<ContribPoint, ContributionState[]>;
}
