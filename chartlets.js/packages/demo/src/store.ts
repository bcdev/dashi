import { create } from "zustand/react";

export interface Dataset {
  id: string;
  title: string;
}

export type ThemeMode = "dark" | "light" | "system";
export const themeModes: ThemeMode[] = ["dark", "light", "system"];

export interface AppState {
  datasets: Dataset[];
  selectedDatasetId: string | null;
  setSelectedDatasetId(setSelectedDatasetId: string | null): void;
  themeMode: ThemeMode;
  setThemeMode(themeMode: ThemeMode): void;
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
  themeMode: "system",
  setThemeMode: (themeMode: "dark" | "light" | "system") => {
    set({ themeMode });
  },
}));

export const useAppStore = appStore;
