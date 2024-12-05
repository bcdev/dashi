// Types
export type { Contribution } from "@/lib/types/model/contribution";
export type { ContributionState } from "@/lib/types/state/contribution";
export type {
  ComponentState,
  ContainerState,
} from "@/lib/types/state/component";
export type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/lib/types/state/event";
// Actions (store changes)
export { initializeContributions } from "@/lib/actions/initializeContributions";
export { handleComponentChange } from "@/lib/actions/handleComponentChange";
export { updateContributionContainer } from "@/lib/actions/updateContributionContainer";
// Component registry
export type { Registry } from "@/lib/component/Registry";
// React components
export { Component, type ComponentProps } from "@/lib/component/Component";
export { Children } from "@/lib/component/Children";
// React hooks
export {
  useConfiguration,
  useExtensions,
  useContributionsResult,
  useContributionsRecord,
  useContributions,
  useComponentChangeHandlers,
  makeContributionsHook,
} from "@/lib/hooks";
// Application interface
export type {
  FrameworkOptions,
  HostStore,
  MutableHostStore,
  Plugin,
  PluginLike,
} from "@/lib/types/state/options";
// Some common utilities
export { isObject } from "@/lib/utils/isObject";
export { isString } from "@/lib/utils/isString";
