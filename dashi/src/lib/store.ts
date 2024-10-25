import { create } from "zustand";

import { type StoreState } from "@/lib/types/state/store";

export const store = create<StoreState>(() => ({
  configuration: {},
  contributionsResult: {},
  extensions: [],
  contributionModelsRecord: {},
  contributionStatesRecord: {},
}));
