import * as vegaThemes from "vega-themes";
import { useThemeMode } from "@/hooks";
import { useMemo } from "react";

export type VegaTheme = keyof Omit<typeof vegaThemes, "version">;

const isVegaTheme = (key?: string): key is VegaTheme =>
  !!key && key in vegaThemes;

const isSystemThemeDark = (): boolean =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function useVegaTheme(
  theme: VegaTheme | "default" | "system" | undefined,
): VegaTheme | undefined {
  const themeMode = useThemeMode();
  return useMemo(() => {
    if (!theme || theme === "default") {
      return themeMode === "dark" ||
        (themeMode === "system" && isSystemThemeDark())
        ? "dark"
        : undefined;
    } else if (theme === "system") {
      return isSystemThemeDark() ? "dark" : undefined;
    } else {
      return isVegaTheme(theme) ? theme : undefined;
    }
  }, [theme, themeMode]);
}
