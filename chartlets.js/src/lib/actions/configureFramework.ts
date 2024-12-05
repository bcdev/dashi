import { store } from "@/lib/store";
import type {
  ComponentRegistration,
  FrameworkOptions,
  PluginLike,
} from "@/lib/types/state/options";
import { registry } from "@/lib/component/Registry";
import { isPromise } from "@/lib/utils/isPromise";
import { isFunction } from "@/lib/utils/isFunction";
import { isObject } from "@/lib/utils/isObject";
import { handleHostStoreChange } from "./handleHostStoreChange";
import { configureLogging } from "./helpers/configureLogging";

export function configureFramework(options: FrameworkOptions) {
  if (options.logging) {
    configureLogging(options.logging);
  }
  if (options.hostStore) {
    options.hostStore.subscribe(handleHostStoreChange);
  }
  store.setState({
    configuration: { ...options } as FrameworkOptions,
  });
  if (options.plugins) {
    options.plugins.forEach(resolvePlugin);
  }
}

function resolvePlugin(plugin: PluginLike) {
  if (isPromise<PluginLike>(plugin)) {
    plugin.then(resolvePlugin);
  } else if (isFunction(plugin)) {
    resolvePlugin(plugin());
  } else if (isObject(plugin) && plugin.components) {
    (plugin.components as ComponentRegistration[]).forEach(
      ([name, component]) => {
        registry.register(name, component);
      },
    );
  }
}
