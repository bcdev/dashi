import { CSSProperties } from "react";
import {
  ComponentModel,
  ContributionChangeHandler,
  PropertyChangeEvent,
} from "../model/component";
import { ContributionModel } from "../model/contribution";
import DashiComponent from "./DashiComponent";

export interface DashiContributionProps {
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
