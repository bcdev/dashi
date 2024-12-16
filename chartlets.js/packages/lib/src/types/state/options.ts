import type { ApiOptions } from "@/types/api";
import type { PluginLike } from "@/types/state/plugin";
import type { HostStore } from "@/types/state/host";
import type { LoggingOptions } from "@/actions/helpers/configureLogging";

/**
 * Chartlets options to be provided
 * by the application that is using Chartlets.
 */
export interface FrameworkOptions {
  /** API options to configure backend. */
  api?: ApiOptions;

  /** Framework plugins. */
  plugins?: PluginLike[];

  /** The host store. */
  hostStore?: HostStore;

  /** Logging options. */
  logging?: LoggingOptions;
}
