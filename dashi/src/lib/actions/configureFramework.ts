import { store } from "@/lib/store";
import type { FrameworkOptions } from "@/lib/types/state/store";
import { configureLogging } from "@/lib/utils/configureLogging";

export function configureFramework(options: FrameworkOptions) {
  if (options.logging) {
    configureLogging(options.logging);
  }
  const { configuration } = store.getState();
  store.setState({
    configuration: { ...configuration, ...options },
  });
}