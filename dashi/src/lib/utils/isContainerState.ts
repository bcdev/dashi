import {
  type ComponentState,
  type ContainerState,
} from "@/lib/types/state/component";

export function isContainerState(
  componentModel: ComponentState,
): componentModel is ContainerState {
  return !!componentModel.components;
}
