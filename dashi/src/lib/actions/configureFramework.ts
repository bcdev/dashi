import { store } from "@/lib/store";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureLogging } from "@/lib/utils/configureLogging";

export function configureFramework(options?: FrameworkOptions) {
  const { loggingOptions, ...storeOptions } = options || {};
  if (loggingOptions) {
    configureLogging(loggingOptions);
  }
  store.setState(storeOptions);
}
