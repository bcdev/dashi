/////////////////////////////////////////////////////////////////////
// The Chartlets TypeScript API

// Types
export { type Contribution } from "@/lib/types/model/contribution";
export { type ContributionState } from "@/lib/types/state/contribution";
export type {
  ComponentState,
  ContainerState,
} from "@/lib/types/state/component";
export {
  type ComponentChangeEvent,
  type ComponentChangeHandler,
} from "@/lib/types/state/event";
// Actions (store changes)
export { initializeContributions } from "@/lib/actions/initializeContributions";
export { handleComponentChange } from "@/lib/actions/handleComponentChange";
export { updateContributionContainer } from "@/lib/actions/updateContributionContainer";
// Component registry
export { type Registry, registry } from "@/lib/component/Registry";
// React components
export { Component } from "@/lib/component/Component";
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
export { type HostStore } from "@/lib/types/state/options";

/////////////////////////////////////////////////////////////////////
// Register standard Chartlets components

import { registry } from "@/lib/component/Registry";

import { Box } from "@/lib/components/Box";
import { Button } from "@/lib/components/Button";
import { Checkbox } from "@/lib/components/Checkbox";
import { CircularProgress } from "@/lib/components/CircularProgress";
import { Plot } from "@/lib/components/Plot";
import { Select } from "@/lib/components/Select";
import { Typography } from "@/lib/components/Typography";

registry.register("Box", Box);
registry.register("Button", Button);
registry.register("Checkbox", Checkbox);
registry.register("CircularProgress", CircularProgress);
registry.register("Plot", Plot);
registry.register("Select", Select);
registry.register("Typography", Typography);
