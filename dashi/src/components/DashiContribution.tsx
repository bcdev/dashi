import { CSSProperties } from "react";
import {
  ComponentModel,
  ContributionChangeHandler,
  PropertyChangeEvent,
} from "../model/component";
import { Contribution } from "../model/contribution";
import DashiComponent from "./DashiComponent";
import { ContribPoint } from "../store/appStore";

export interface DashiContributionProps {
  componentModel: ComponentModel;
  contribution: Contribution;
  contribPoint: ContribPoint;
  contribIndex: number;
  onPropertyChange: ContributionChangeHandler;
  style?: CSSProperties;
}

function DashiContribution({
  contribution,
  contribPoint,
  contribIndex,
  componentModel,
  style,
  onPropertyChange,
}: DashiContributionProps) {
  const handlePropertyChange = (event: PropertyChangeEvent) => {
    onPropertyChange({ contribPoint, contribIndex, ...event });
  };
  const id = `${contribution.extension}-${contribPoint}-${componentModel.name}`;
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
