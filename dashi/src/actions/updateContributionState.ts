import appStore, {
  AppState,
  ContribPoint,
  ContributionState,
} from "../store/appStore";
import { Draft, produce } from "immer";

export function updateContributionState(
  contribPoint: ContribPoint,
  contribIndex: number,
  contribState: Partial<ContributionState>,
) {
  appStore.setState(
    produce(appStore.getState(), (draft: Draft<AppState>) => {
      const contributions = draft.contributionStatesRecord[contribPoint];
      contributions[contribIndex] = {
        ...contributions[contribIndex],
        ...contribState,
      };
    }),
  );
}
