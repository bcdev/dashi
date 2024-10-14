import systemStore from "@/store/system";

export const useSystemStore = systemStore;
export const useExtensions = () => useSystemStore((state) => state.extensions);
export const useContributionsResult = () =>
  useSystemStore((state) => state.contributionsResult);
export const useContributionStatesRecord = () =>
  useSystemStore((state) => state.contributionStatesRecord);
export const useContributionModelsRecord = () =>
  useSystemStore((state) => state.contributionModelsRecord);
