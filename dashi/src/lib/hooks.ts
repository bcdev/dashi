import { store } from "@/lib/store";

export const useStore = store;
export const useExtensions = () => useStore((state) => state.extensions);
export const useContributionsResult = () =>
  useStore((state) => state.contributionsResult);
export const useContributionStatesRecord = () =>
  useStore((state) => state.contributionStatesRecord);
