// Types
export type { Contribution } from "@/types/model/contribution";
export type { ContributionState } from "@/types/state/contribution";
export type { ComponentState, ContainerState } from "@/types/state/component";
export type {
  ComponentChangeEvent,
  ComponentChangeHandler,
} from "@/types/state/event";
export type { ThemeMode } from "@/types/state/store";

// Actions (store changes)
export { initializeContributions } from "@/actions/initializeContributions";
export { handleComponentChange } from "@/actions/handleComponentChange";
export { updateContributionContainer } from "@/actions/updateContributionContainer";

// React components
export { Component, type ComponentProps } from "@/components/Component";
export { Children, type ChildrenProps } from "@/components/Children";

// React hooks
export {
  useConfiguration,
  useExtensions,
  useContributionsResult,
  useContributionsRecord,
  useContributions,
  useComponentChangeHandlers,
  useThemeMode,
} from "@/hooks";

// Application interface
export type {
  FrameworkOptions,
  HostStore,
  MutableHostStore,
  Plugin,
  PluginLike,
} from "@/types/state/options";
