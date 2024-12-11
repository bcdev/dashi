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

export function configureFramework(options?: FrameworkOptions) {
  options = options || {};
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

export function resolvePlugin(plugin: PluginLike): Promise<Plugin | undefined> {
  if (isPromise<PluginLike>(plugin)) {
    return plugin.then(resolvePlugin);
  } else if (isFunction(plugin)) {
    return resolvePlugin(plugin());
  } else if (isObject(plugin) && plugin.components) {
    (plugin.components as ComponentRegistration[]).forEach(
      ([name, component]) => {
        registry.register(name, component);
      },
    );
    return Promise.resolve(plugin);
  }
  return Promise.resolve(undefined);
}
