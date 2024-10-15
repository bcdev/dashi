import { create } from "zustand/index";

import { type StoreState } from "@/lib/types/state/store";

export const store = create<StoreState>(() => ({
  contributionsResult: {},
  extensions: [],
  contributionModelsRecord: {},
  contributionStatesRecord: {},
}));
