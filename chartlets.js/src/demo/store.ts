import { create } from "zustand/react";

export interface Dataset {
  id: string;
  title: string;
}

export interface AppState {
  datasets: Dataset[];
  selectedDatasetId: string | null;
  setSelectedDatasetId(setSelectedDatasetId: string | null): void;
}

export const appStore = create<AppState>((set, get) => ({
  // TODO: get from demo server
  datasets: [
    { id: "ds0", title: "Dataset #1" },
    { id: "ds1", title: "Dataset #2" },
  ],
  selectedDatasetId: "ds0",
  setSelectedDatasetId: (selectedDatasetId: string | null) => {
    if (selectedDatasetId !== get().selectedDatasetId) {
      set({ selectedDatasetId });
    }
  },
}));

export const useAppStore = appStore;
