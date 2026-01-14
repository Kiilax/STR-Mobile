/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, TextStyle } from "react-native";

const dark = {
  primary: "#171C22",
  secondary: "#20272F",
  accent: "#2AD783",
  white: "#FDFDFD",
};

const light = {
  primary: "#fff",
  secondary: "#F7F9FA",
  accent: "#2AD783",
  black: "#11181C",
};

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  labelSmall: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
};

export const colors = {
  light: {
    text: light.black,
    background: light.primary,
    tint: light.accent,
    icon: light.black,
    tabIconDefault: light.secondary,
    tabIconSelected: light.accent,
    primary: "#fff",
    secondary: "#F7F9FA",
    accent: "#2AD783",
    inverted: "#11181C",
  },
  dark: {
    text: dark.white,
    background: dark.primary,
    tint: dark.accent,
    icon: dark.white,
    tabIconDefault: dark.secondary,
    tabIconSelected: dark.accent,
    primary: "#171C22",
    secondary: "#20272F",
    accent: "#2AD783",
    inverted: "#FDFDFD",
  },
};

export const fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const darkTheme = {
  dark: true,
  colors: {
    primary: dark.accent,
    background: dark.primary,
    card: dark.secondary,
    text: dark.white,
    border: dark.secondary,
    notification: dark.accent,
  },
  fonts: {
    light: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "300" as const,
    },
    regular: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "normal" as const,
    },
    medium: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "500" as const,
    },
    bold: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "bold" as const,
    },
    heavy: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "700" as const,
    },
  },
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: light.accent,
    background: light.primary,
    card: light.secondary,
    text: light.black,
    border: light.secondary,
    notification: light.accent,
  },
  fonts: {
    light: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "300" as const,
    },
    regular: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "normal" as const,
    },
    medium: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "500" as const,
    },
    bold: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "bold" as const,
    },
    heavy: {
      fontFamily: "Inter, Arial, sans-serif",
      fontWeight: "700" as const,
    },
  },
};
