import { type ContributionState, useContributionsRecord } from "@/lib";
import type { PanelState } from "@/demo/types";

export function usePanelStates() {
  const contributionStatesRecord = useContributionsRecord();
  return contributionStatesRecord["panels"] as ContributionState<PanelState>[];
}
