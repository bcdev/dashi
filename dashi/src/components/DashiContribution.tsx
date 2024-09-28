import {
  PropertyChangeEvent,
  ComponentModel,
  ContributionChangeHandler,
} from "../model/component.ts";
import { ContributionModel } from "../model/extension.ts";
import DashiComponent from "./DashiComponent.tsx";
import { CSSProperties } from "react";

export interface DashiContributionProps {
  //extensionState: Record<string, unknown>;
  componentModel: ComponentModel;
  contributionModel: ContributionModel;
  contribPoint: string;
  contribIndex: number;
  onPropertyChange: ContributionChangeHandler;
  style?: CSSProperties;
}

function DashiContribution({
  contributionModel,
  contribPoint,
  contribIndex,
  componentModel,
  style,
  onPropertyChange,
}: DashiContributionProps) {
  const handlePropertyChange = (event: PropertyChangeEvent) => {
    onPropertyChange({ contribPoint, contribIndex, ...event });
  };
  const id = `${contributionModel.extension}-${contribPoint}-${componentModel.name}`;
  return (
    <div id={id} key={id} style={style}>
      <DashiComponent
        {...componentModel}
        onPropertyChange={handlePropertyChange}
      />
    </div>
  );
}

export default DashiContribution;
