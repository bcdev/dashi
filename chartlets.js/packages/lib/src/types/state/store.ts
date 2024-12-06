import type {
  ContribPoint,
  Contributions,
  Extension,
} from "@/types/model/extension";
import type { ContributionState } from "@/types/state/contribution";
import type { ApiResult } from "@/types/api";
import type { FrameworkOptions } from "./options";

export type ThemeMode = "dark" | "light" | "system";

export interface StoreState {
  /** Framework configuration */
  configuration: FrameworkOptions;
  /** All extensions */
  extensions: Extension[];
  /** API call result from `GET /contributions`. */
  contributionsResult: ApiResult<Contributions>;
  /** A record that maps contribPoint --> ContributionState[].*/
  contributionsRecord: Record<ContribPoint, ContributionState[]>;
  /**
   * The app's current theme mode.
   * Taken from the host stores `themeMode` property.
   * Used to allow components and charts to react to theme mode changes.
   * See hook `useThemeMode()`.
   */
  themeMode?: ThemeMode;
}
