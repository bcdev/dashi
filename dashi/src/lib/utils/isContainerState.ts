import {
  type ComponentState,
  type ContainerState,
} from "@/lib/types/state/component";

export function isContainerState(
  component: ComponentState,
): component is ContainerState {
  return !!component.components;
}
