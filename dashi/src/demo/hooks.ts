import { type ContributionState, useContributionStatesRecord } from "@/lib";
import type { PanelState } from "@/demo/types";

export function usePanelStates() {
  const contributionStatesRecord = useContributionStatesRecord();
  return contributionStatesRecord["panels"] as ContributionState<PanelState>[];
}
