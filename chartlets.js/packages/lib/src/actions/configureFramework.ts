import { store } from "@/store";
import type {
  ComponentRegistration,
  FrameworkOptions,
  PluginLike,
} from "@/types/state/options";
import { registry } from "@/components/registry";
import { isPromise } from "@/utils/isPromise";
import { isFunction } from "@/utils/isFunction";
import { isObject } from "@/utils/isObject";
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
