import { store } from "@/lib/store";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureLogging } from "@/lib/actions/helpers/configureLogging";
import { handleHostStoreChange } from "./handleHostStoreChange";

export function configureFramework<S extends object = object>(
  options: FrameworkOptions<S>,
) {
  if (options.logging) {
    configureLogging(options.logging);
  }
  if (options.hostStore) {
    options.hostStore.subscribe(handleHostStoreChange);
  }
  store.setState({
    configuration: { ...options } as FrameworkOptions<object>,
  });
}
