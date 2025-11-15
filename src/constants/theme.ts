/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native"

const dark = {
  primary: "#171C22",
  secondary: "#20272F",
  accent: "#2AD783",
  white: "#FDFDFD",
}

const light = {
  primary: "#fff",
  secondary: "#F7F9FA",
  accent: "#2AD783",
  black: "#11181C",
}

export const colors = {
  light: {
    text: light.black,
    background: light.primary,
    tint: light.accent,
    icon: light.black,
    tabIconDefault: light.secondary,
    tabIconSelected: light.accent,
    black: light.black,
  },
  dark: {
    text: dark.white,
    background: dark.primary,
    tint: dark.accent,
    icon: dark.white,
    tabIconDefault: dark.secondary,
    tabIconSelected: dark.accent,
    white: dark.white,
  },
}

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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})

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
    light: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "300" as const },
    regular: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "normal" as const },
    medium: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "500" as const },
    bold: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "bold" as const },
    heavy: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "700" as const },
  },
}

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
    light: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "300" as const },
    regular: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "normal" as const },
    medium: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "500" as const },
    bold: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "bold" as const },
    heavy: { fontFamily: "Inter, Arial, sans-serif", fontWeight: "700" as const },
  },
}
