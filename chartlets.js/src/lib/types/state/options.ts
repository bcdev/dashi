import type { ApiOptions } from "@/lib/types/api";
import type { LoggingOptions } from "@/lib/actions/helpers/configureLogging";

export interface HostStore {
  subscribe: (listener: () => void) => void;
  get: (property: string) => unknown;
  set?: (property: string, value: unknown) => void;
}

export interface MutableHostStore extends HostStore {
  set: (property: string, value: unknown) => void;
}

export function isMutableHostStore(
  hostStore: HostStore | undefined,
): hostStore is MutableHostStore {
  return !!hostStore && typeof hostStore.set === "function";
}

export interface FrameworkOptions {
  /** The host application's store. */
  hostStore?: HostStore;
  /** API options to configure backend. */
  api?: ApiOptions;
  /** Logging options. */
  logging?: LoggingOptions;
}
