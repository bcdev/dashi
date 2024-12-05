import { create } from "zustand";

import { type StoreState } from "@/types/state/store";

export const store = create<StoreState>(() => ({
  configuration: {},
  extensions: [],
  contributionsResult: {},
  contributionsRecord: {},
}));
