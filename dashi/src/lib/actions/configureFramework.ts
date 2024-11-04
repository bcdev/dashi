import { store } from "@/lib/store";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureLogging } from "@/lib/utils/configureLogging";
import { handleHostStoreChange } from "./handleHostStoreChange";

export function configureFramework<S extends object = object>(
  options: FrameworkOptions<S>,
) {
  if (options.logging) {
    configureLogging(options.logging);
  }
  const { configuration } = store.getState();
  if (configuration.hostStore) {
    configuration.hostStore.subscribe(handleHostStoreChange);
  }
  store.setState({
    configuration: { ...configuration, ...options },
  });
}
