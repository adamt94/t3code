import { type ITheme } from "@xterm/xterm";
import { type ColorScheme } from "@t3tools/contracts/settings";

export interface TerminalThemePair {
  label: string;
  dark: ITheme;
  light: ITheme;
}

// ── GitHub ───────────────────────────────────────────────────────────────────

const GITHUB: TerminalThemePair = {
  label: "GitHub",
  dark: {
    background: "#0d1117",
    foreground: "#e6edf3",
    cursor: "#e6edf3",
    selectionBackground: "rgba(230, 237, 243, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#21262d",
    red: "#ff7b72",
    green: "#3fb950",
    yellow: "#d29922",
    blue: "#58a6ff",
    magenta: "#bc8cff",
    cyan: "#39c5cf",
    white: "#b1bac4",
    brightBlack: "#6e7681",
    brightRed: "#ffa198",
    brightGreen: "#56d364",
    brightYellow: "#e3b341",
    brightBlue: "#79c0ff",
    brightMagenta: "#d2a8ff",
    brightCyan: "#56d4dd",
    brightWhite: "#f0f6fc",
  },
  light: {
    background: "#ffffff",
    foreground: "#24292f",
    cursor: "#24292f",
    selectionBackground: "rgba(36, 41, 47, 0.15)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#24292f",
    red: "#cf222e",
    green: "#116329",
    yellow: "#4d2d00",
    blue: "#0550ae",
    magenta: "#8250df",
    cyan: "#1b7c83",
    white: "#6e7781",
    brightBlack: "#57606a",
    brightRed: "#a40e26",
    brightGreen: "#1a7f37",
    brightYellow: "#633c01",
    brightBlue: "#0969da",
    brightMagenta: "#6639ba",
    brightCyan: "#1b7c83",
    brightWhite: "#8c959f",
  },
};

// ── Solarized ────────────────────────────────────────────────────────────────

const SOLARIZED: TerminalThemePair = {
  label: "Solarized",
  dark: {
    background: "#002b36",
    foreground: "#839496",
    cursor: "#839496",
    selectionBackground: "rgba(131, 148, 150, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#073642",
    red: "#dc322f",
    green: "#859900",
    yellow: "#b58900",
    blue: "#268bd2",
    magenta: "#d33682",
    cyan: "#2aa198",
    white: "#eee8d5",
    brightBlack: "#002b36",
    brightRed: "#cb4b16",
    brightGreen: "#586e75",
    brightYellow: "#657b83",
    brightBlue: "#839496",
    brightMagenta: "#6c71c4",
    brightCyan: "#93a1a1",
    brightWhite: "#fdf6e3",
  },
  light: {
    background: "#fdf6e3",
    foreground: "#657b83",
    cursor: "#586e75",
    selectionBackground: "rgba(101, 123, 131, 0.2)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#073642",
    red: "#dc322f",
    green: "#859900",
    yellow: "#b58900",
    blue: "#268bd2",
    magenta: "#d33682",
    cyan: "#2aa198",
    white: "#eee8d5",
    brightBlack: "#002b36",
    brightRed: "#cb4b16",
    brightGreen: "#586e75",
    brightYellow: "#657b83",
    brightBlue: "#839496",
    brightMagenta: "#6c71c4",
    brightCyan: "#93a1a1",
    brightWhite: "#fdf6e3",
  },
};

// ── Catppuccin (Mocha dark / Latte light) ────────────────────────────────────

const CATPPUCCIN: TerminalThemePair = {
  label: "Catppuccin",
  dark: {
    // Mocha
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    cursor: "#f5e0dc",
    selectionBackground: "rgba(205, 214, 244, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#45475a",
    red: "#f38ba8",
    green: "#a6e3a1",
    yellow: "#f9e2af",
    blue: "#89b4fa",
    magenta: "#cba4f7",
    cyan: "#89dceb",
    white: "#bac2de",
    brightBlack: "#585b70",
    brightRed: "#f38ba8",
    brightGreen: "#a6e3a1",
    brightYellow: "#f9e2af",
    brightBlue: "#89b4fa",
    brightMagenta: "#cba4f7",
    brightCyan: "#89dceb",
    brightWhite: "#a6adc8",
  },
  light: {
    // Latte
    background: "#eff1f5",
    foreground: "#4c4f69",
    cursor: "#dc8a78",
    selectionBackground: "rgba(76, 79, 105, 0.15)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#5c5f77",
    red: "#d20f39",
    green: "#40a02b",
    yellow: "#df8e1d",
    blue: "#1e66f5",
    magenta: "#8839ef",
    cyan: "#179299",
    white: "#acb0be",
    brightBlack: "#6c6f85",
    brightRed: "#d20f39",
    brightGreen: "#40a02b",
    brightYellow: "#df8e1d",
    brightBlue: "#1e66f5",
    brightMagenta: "#8839ef",
    brightCyan: "#179299",
    brightWhite: "#bcc0cc",
  },
};

// ── One (One Dark / One Light) ───────────────────────────────────────────────

const ONE: TerminalThemePair = {
  label: "One",
  dark: {
    background: "#282c34",
    foreground: "#abb2bf",
    cursor: "#528bff",
    selectionBackground: "rgba(171, 178, 191, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#3f4451",
    red: "#e06c75",
    green: "#98c379",
    yellow: "#e5c07b",
    blue: "#61afef",
    magenta: "#c678dd",
    cyan: "#56b6c2",
    white: "#9da5b4",
    brightBlack: "#4f5666",
    brightRed: "#ff7b86",
    brightGreen: "#b1e18b",
    brightYellow: "#efcb6b",
    brightBlue: "#67cdff",
    brightMagenta: "#e48bff",
    brightCyan: "#63d4e5",
    brightWhite: "#e6e6e6",
  },
  light: {
    background: "#fafafa",
    foreground: "#383a42",
    cursor: "#526fff",
    selectionBackground: "rgba(56, 58, 66, 0.15)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#383a42",
    red: "#e45649",
    green: "#50a14f",
    yellow: "#c18401",
    blue: "#4078f2",
    magenta: "#a626a4",
    cyan: "#0184bc",
    white: "#a0a1a7",
    brightBlack: "#4f525e",
    brightRed: "#e45649",
    brightGreen: "#50a14f",
    brightYellow: "#c18401",
    brightBlue: "#4078f2",
    brightMagenta: "#a626a4",
    brightCyan: "#0184bc",
    brightWhite: "#ffffff",
  },
};

// ── Tokyo Night (Night / Day) ─────────────────────────────────────────────────

const TOKYO_NIGHT: TerminalThemePair = {
  label: "Tokyo Night",
  dark: {
    background: "#1a1b26",
    foreground: "#c0caf5",
    cursor: "#c0caf5",
    selectionBackground: "rgba(192, 202, 245, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#15161e",
    red: "#f7768e",
    green: "#9ece6a",
    yellow: "#e0af68",
    blue: "#7aa2f7",
    magenta: "#bb9af7",
    cyan: "#7dcfff",
    white: "#a9b1d6",
    brightBlack: "#414868",
    brightRed: "#f7768e",
    brightGreen: "#9ece6a",
    brightYellow: "#e0af68",
    brightBlue: "#7aa2f7",
    brightMagenta: "#bb9af7",
    brightCyan: "#7dcfff",
    brightWhite: "#c0caf5",
  },
  light: {
    // Tokyo Night Day
    background: "#e1e2e7",
    foreground: "#3760bf",
    cursor: "#3760bf",
    selectionBackground: "rgba(55, 96, 191, 0.15)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#e9e9ed",
    red: "#f52a65",
    green: "#587539",
    yellow: "#8c6c3e",
    blue: "#2e7de9",
    magenta: "#9854f1",
    cyan: "#007197",
    white: "#6172b0",
    brightBlack: "#a1a6c5",
    brightRed: "#f52a65",
    brightGreen: "#587539",
    brightYellow: "#8c6c3e",
    brightBlue: "#2e7de9",
    brightMagenta: "#9854f1",
    brightCyan: "#007197",
    brightWhite: "#3760bf",
  },
};

// ── Gruvbox ───────────────────────────────────────────────────────────────────

const GRUVBOX: TerminalThemePair = {
  label: "Gruvbox",
  dark: {
    background: "#282828",
    foreground: "#ebdbb2",
    cursor: "#ebdbb2",
    selectionBackground: "rgba(235, 219, 178, 0.2)",
    scrollbarSliderBackground: "rgba(255, 255, 255, 0.1)",
    scrollbarSliderHoverBackground: "rgba(255, 255, 255, 0.18)",
    scrollbarSliderActiveBackground: "rgba(255, 255, 255, 0.22)",
    black: "#282828",
    red: "#cc241d",
    green: "#98971a",
    yellow: "#d79921",
    blue: "#458588",
    magenta: "#b16286",
    cyan: "#689d6a",
    white: "#a89984",
    brightBlack: "#928374",
    brightRed: "#fb4934",
    brightGreen: "#b8bb26",
    brightYellow: "#fabd2f",
    brightBlue: "#83a598",
    brightMagenta: "#d3869b",
    brightCyan: "#8ec07c",
    brightWhite: "#ebdbb2",
  },
  light: {
    background: "#fbf1c7",
    foreground: "#3c3836",
    cursor: "#3c3836",
    selectionBackground: "rgba(60, 56, 54, 0.15)",
    scrollbarSliderBackground: "rgba(0, 0, 0, 0.15)",
    scrollbarSliderHoverBackground: "rgba(0, 0, 0, 0.25)",
    scrollbarSliderActiveBackground: "rgba(0, 0, 0, 0.3)",
    black: "#3c3836",
    red: "#cc241d",
    green: "#98971a",
    yellow: "#d79921",
    blue: "#458588",
    magenta: "#b16286",
    cyan: "#689d6a",
    white: "#7c6f64",
    brightBlack: "#928374",
    brightRed: "#9d0006",
    brightGreen: "#79740e",
    brightYellow: "#b57614",
    brightBlue: "#076678",
    brightMagenta: "#8f3f71",
    brightCyan: "#427b58",
    brightWhite: "#3c3836",
  },
};

// ── Exports ───────────────────────────────────────────────────────────────────

export const TERMINAL_THEME_PAIRS: Record<
  Exclude<ColorScheme, "app">,
  TerminalThemePair
> = {
  github: GITHUB,
  solarized: SOLARIZED,
  catppuccin: CATPPUCCIN,
  one: ONE,
  "tokyo-night": TOKYO_NIGHT,
  gruvbox: GRUVBOX,
};

export const TERMINAL_COLOR_SCHEME_OPTIONS: Array<{
  value: ColorScheme;
  label: string;
}> = [
  { value: "app", label: "App theme" },
  { value: "github", label: GITHUB.label },
  { value: "solarized", label: SOLARIZED.label },
  { value: "catppuccin", label: CATPPUCCIN.label },
  { value: "one", label: ONE.label },
  { value: "tokyo-night", label: TOKYO_NIGHT.label },
  { value: "gruvbox", label: GRUVBOX.label },
];

/**
 * Resolves the xterm ITheme for a named color scheme + the current dark/light
 * mode. Returns null when the scheme is "app" so the caller falls back to the
 * app-derived theme.
 */
export function resolveColorSchemeTheme(
  scheme: ColorScheme,
  isDark: boolean,
): ITheme | null {
  if (scheme === "app") return null;
  const pair = TERMINAL_THEME_PAIRS[scheme];
  return isDark ? pair.dark : pair.light;
}
