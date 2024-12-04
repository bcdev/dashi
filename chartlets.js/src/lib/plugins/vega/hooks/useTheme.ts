import * as vegaThemes from "vega-themes";

export type VegaTheme = keyof Omit<typeof vegaThemes, "version">;

const isVegaTheme = (key?: string): key is VegaTheme =>
  !!key && key in vegaThemes;

const isSystemThemeDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)");

export function useTheme(
  theme: VegaTheme | "default" | "system" | string | undefined,
): VegaTheme | undefined {
  return theme === "system" && isSystemThemeDark()
    ? "dark"
    : isVegaTheme(theme)
      ? theme
      : undefined;
}
