import { CSSProperties } from "react";

import { ComponentState } from "@/state/component";
import { Contribution } from "@/model/contribution";
import { ContributionChangeHandler, PropertyChangeEvent } from "@/model/event";
import { ContribPoint } from "@/model/extension";
import DashiComponent from "./DashiComponent";

export interface DashiContributionProps {
  componentModel: ComponentState;
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
