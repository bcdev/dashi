import { type ComponentChangeHandler } from "@/types/state/event";
import { registry } from "@/components/Registry";

export interface ComponentProps {
  type: string;
  onChange: ComponentChangeHandler;
}

export function Component(props: ComponentProps) {
  const { type: componentType } = props;
  const ActualComponent = registry.lookup(componentType);
  if (typeof ActualComponent === "function") {
    return <ActualComponent {...props} />;
  } else {
    console.error(
      `chartlets: invalid component type encountered: ${componentType}`,
    );
    return null;
  }
}
