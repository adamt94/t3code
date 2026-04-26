import { type ColorScheme } from "@t3tools/contracts/settings";
import { syncBrowserChromeTheme } from "~/hooks/useTheme";

// ── CSS variable shape ────────────────────────────────────────────────────────

interface AppThemeVars {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
}

interface AppThemePair {
  dark: AppThemeVars;
  light: AppThemeVars;
}

// ── Theme definitions ─────────────────────────────────────────────────────────

const GITHUB: AppThemePair = {
  dark: {
    background: "#0d1117",
    foreground: "#e6edf3",
    card: "#161b22",
    cardForeground: "#e6edf3",
    popover: "#161b22",
    popoverForeground: "#e6edf3",
    primary: "#58a6ff",
    primaryForeground: "#0d1117",
    secondary: "rgba(230,237,243,0.06)",
    secondaryForeground: "#e6edf3",
    muted: "rgba(230,237,243,0.05)",
    mutedForeground: "#8b949e",
    accent: "rgba(230,237,243,0.08)",
    accentForeground: "#e6edf3",
    border: "rgba(230,237,243,0.1)",
    input: "rgba(230,237,243,0.1)",
    ring: "#58a6ff",
  },
  light: {
    background: "#ffffff",
    foreground: "#24292f",
    card: "#f6f8fa",
    cardForeground: "#24292f",
    popover: "#ffffff",
    popoverForeground: "#24292f",
    primary: "#0969da",
    primaryForeground: "#ffffff",
    secondary: "rgba(36,41,47,0.05)",
    secondaryForeground: "#24292f",
    muted: "rgba(36,41,47,0.04)",
    mutedForeground: "#57606a",
    accent: "rgba(36,41,47,0.06)",
    accentForeground: "#24292f",
    border: "rgba(36,41,47,0.1)",
    input: "rgba(36,41,47,0.1)",
    ring: "#0969da",
  },
};

const SOLARIZED: AppThemePair = {
  dark: {
    background: "#002b36",
    foreground: "#839496",
    card: "#073642",
    cardForeground: "#839496",
    popover: "#073642",
    popoverForeground: "#839496",
    primary: "#268bd2",
    primaryForeground: "#fdf6e3",
    secondary: "rgba(131,148,150,0.08)",
    secondaryForeground: "#839496",
    muted: "rgba(131,148,150,0.06)",
    mutedForeground: "#586e75",
    accent: "rgba(131,148,150,0.1)",
    accentForeground: "#93a1a1",
    border: "rgba(131,148,150,0.14)",
    input: "rgba(131,148,150,0.14)",
    ring: "#268bd2",
  },
  light: {
    background: "#fdf6e3",
    foreground: "#657b83",
    card: "#eee8d5",
    cardForeground: "#657b83",
    popover: "#fdf6e3",
    popoverForeground: "#657b83",
    primary: "#268bd2",
    primaryForeground: "#fdf6e3",
    secondary: "rgba(101,123,131,0.07)",
    secondaryForeground: "#657b83",
    muted: "rgba(101,123,131,0.06)",
    mutedForeground: "#93a1a1",
    accent: "rgba(101,123,131,0.09)",
    accentForeground: "#586e75",
    border: "rgba(101,123,131,0.16)",
    input: "rgba(101,123,131,0.16)",
    ring: "#268bd2",
  },
};

const CATPPUCCIN: AppThemePair = {
  dark: {
    // Mocha
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    card: "#181825",
    cardForeground: "#cdd6f4",
    popover: "#181825",
    popoverForeground: "#cdd6f4",
    primary: "#89b4fa",
    primaryForeground: "#1e1e2e",
    secondary: "rgba(205,214,244,0.06)",
    secondaryForeground: "#cdd6f4",
    muted: "rgba(205,214,244,0.05)",
    mutedForeground: "#a6adc8",
    accent: "rgba(205,214,244,0.08)",
    accentForeground: "#cdd6f4",
    border: "rgba(205,214,244,0.1)",
    input: "rgba(205,214,244,0.1)",
    ring: "#89b4fa",
  },
  light: {
    // Latte
    background: "#eff1f5",
    foreground: "#4c4f69",
    card: "#e6e9ef",
    cardForeground: "#4c4f69",
    popover: "#eff1f5",
    popoverForeground: "#4c4f69",
    primary: "#1e66f5",
    primaryForeground: "#eff1f5",
    secondary: "rgba(76,79,105,0.06)",
    secondaryForeground: "#4c4f69",
    muted: "rgba(76,79,105,0.05)",
    mutedForeground: "#6c6f85",
    accent: "rgba(76,79,105,0.08)",
    accentForeground: "#4c4f69",
    border: "rgba(76,79,105,0.13)",
    input: "rgba(76,79,105,0.13)",
    ring: "#1e66f5",
  },
};

const ONE: AppThemePair = {
  dark: {
    background: "#282c34",
    foreground: "#abb2bf",
    card: "#21252b",
    cardForeground: "#abb2bf",
    popover: "#21252b",
    popoverForeground: "#abb2bf",
    primary: "#61afef",
    primaryForeground: "#282c34",
    secondary: "rgba(171,178,191,0.07)",
    secondaryForeground: "#abb2bf",
    muted: "rgba(171,178,191,0.06)",
    mutedForeground: "#5c6370",
    accent: "rgba(171,178,191,0.09)",
    accentForeground: "#abb2bf",
    border: "rgba(171,178,191,0.12)",
    input: "rgba(171,178,191,0.12)",
    ring: "#61afef",
  },
  light: {
    background: "#fafafa",
    foreground: "#383a42",
    card: "#f0f0f0",
    cardForeground: "#383a42",
    popover: "#fafafa",
    popoverForeground: "#383a42",
    primary: "#4078f2",
    primaryForeground: "#fafafa",
    secondary: "rgba(56,58,66,0.06)",
    secondaryForeground: "#383a42",
    muted: "rgba(56,58,66,0.05)",
    mutedForeground: "#9d9d9f",
    accent: "rgba(56,58,66,0.08)",
    accentForeground: "#383a42",
    border: "rgba(56,58,66,0.13)",
    input: "rgba(56,58,66,0.13)",
    ring: "#4078f2",
  },
};

const TOKYO_NIGHT: AppThemePair = {
  dark: {
    background: "#1a1b26",
    foreground: "#c0caf5",
    card: "#16161e",
    cardForeground: "#c0caf5",
    popover: "#16161e",
    popoverForeground: "#c0caf5",
    primary: "#7aa2f7",
    primaryForeground: "#1a1b26",
    secondary: "rgba(192,202,245,0.07)",
    secondaryForeground: "#c0caf5",
    muted: "rgba(192,202,245,0.05)",
    mutedForeground: "#565f89",
    accent: "rgba(192,202,245,0.09)",
    accentForeground: "#c0caf5",
    border: "rgba(192,202,245,0.1)",
    input: "rgba(192,202,245,0.1)",
    ring: "#7aa2f7",
  },
  light: {
    // Tokyo Night Day
    background: "#e1e2e7",
    foreground: "#3760bf",
    card: "#d5d6db",
    cardForeground: "#3760bf",
    popover: "#e1e2e7",
    popoverForeground: "#3760bf",
    primary: "#2e7de9",
    primaryForeground: "#e1e2e7",
    secondary: "rgba(55,96,191,0.06)",
    secondaryForeground: "#3760bf",
    muted: "rgba(55,96,191,0.05)",
    mutedForeground: "#848cb5",
    accent: "rgba(55,96,191,0.08)",
    accentForeground: "#3760bf",
    border: "rgba(55,96,191,0.14)",
    input: "rgba(55,96,191,0.14)",
    ring: "#2e7de9",
  },
};

const GRUVBOX: AppThemePair = {
  dark: {
    background: "#282828",
    foreground: "#ebdbb2",
    card: "#1d2021",
    cardForeground: "#ebdbb2",
    popover: "#1d2021",
    popoverForeground: "#ebdbb2",
    primary: "#83a598",
    primaryForeground: "#1d2021",
    secondary: "rgba(235,219,178,0.07)",
    secondaryForeground: "#ebdbb2",
    muted: "rgba(235,219,178,0.05)",
    mutedForeground: "#928374",
    accent: "rgba(235,219,178,0.09)",
    accentForeground: "#ebdbb2",
    border: "rgba(235,219,178,0.11)",
    input: "rgba(235,219,178,0.11)",
    ring: "#83a598",
  },
  light: {
    background: "#fbf1c7",
    foreground: "#3c3836",
    card: "#f2e5bc",
    cardForeground: "#3c3836",
    popover: "#fbf1c7",
    popoverForeground: "#3c3836",
    primary: "#076678",
    primaryForeground: "#fbf1c7",
    secondary: "rgba(60,56,54,0.06)",
    secondaryForeground: "#3c3836",
    muted: "rgba(60,56,54,0.05)",
    mutedForeground: "#7c6f64",
    accent: "rgba(60,56,54,0.08)",
    accentForeground: "#3c3836",
    border: "rgba(60,56,54,0.13)",
    input: "rgba(60,56,54,0.13)",
    ring: "#076678",
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────

const APP_THEME_PAIRS: Record<Exclude<ColorScheme, "app">, AppThemePair> = {
  github: GITHUB,
  solarized: SOLARIZED,
  catppuccin: CATPPUCCIN,
  one: ONE,
  "tokyo-night": TOKYO_NIGHT,
  gruvbox: GRUVBOX,
};

// ── Style injection ───────────────────────────────────────────────────────────

const STYLE_ID = "t3code-color-scheme-override";

function buildVarBlock(vars: AppThemeVars): string {
  return [
    `--background: ${vars.background};`,
    `--foreground: ${vars.foreground};`,
    `--card: ${vars.card};`,
    `--card-foreground: ${vars.cardForeground};`,
    `--popover: ${vars.popover};`,
    `--popover-foreground: ${vars.popoverForeground};`,
    `--primary: ${vars.primary};`,
    `--primary-foreground: ${vars.primaryForeground};`,
    `--secondary: ${vars.secondary};`,
    `--secondary-foreground: ${vars.secondaryForeground};`,
    `--muted: ${vars.muted};`,
    `--muted-foreground: ${vars.mutedForeground};`,
    `--accent: ${vars.accent};`,
    `--accent-foreground: ${vars.accentForeground};`,
    `--border: ${vars.border};`,
    `--input: ${vars.input};`,
    `--ring: ${vars.ring};`,
  ]
    .map((line) => `  ${line}`)
    .join("\n");
}

function buildStylesheet(pair: AppThemePair): string {
  return `:root {\n  color-scheme: light;\n${buildVarBlock(pair.light)}\n}\n:root.dark {\n  color-scheme: dark;\n${buildVarBlock(pair.dark)}\n}`;
}

/**
 * Injects CSS variable overrides for the named color scheme into a dedicated
 * <style> element. When "app" is selected the element is removed so the
 * built-in CSS takes back full control.
 *
 * Both dark and light variants are injected at once — the existing .dark class
 * toggle on <html> drives which variant is active, so this only needs to run
 * when the scheme itself changes.
 */
export function applyAppColorScheme(scheme: ColorScheme): void {
  document.getElementById(STYLE_ID)?.remove();

  if (scheme === "app") {
    syncBrowserChromeTheme();
    return;
  }

  const pair = APP_THEME_PAIRS[scheme];
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = buildStylesheet(pair);
  document.head.append(style);

  syncBrowserChromeTheme();
}
