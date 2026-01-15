import { StyleSheet } from "react-native";
import { colors, typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    gap: 10,
    marginVertical: 6,
  },

  sizeSm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  variantPrimary: {
    backgroundColor: colors.dark.accent,
  },
  variantSecondary: {
    backgroundColor: colors.dark.secondary,
    borderWidth: 1,
    borderColor: colors.dark.accent,
  },
  variantDanger: {
    backgroundColor: "#F44336",
  },
  variantOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.dark.tint,
  },
  variantGhost: {
    backgroundColor: "transparent",
  },
  variantSuccess: {
    backgroundColor: "#2E7D32",
  },

  text: {
    fontWeight: typography.button.fontWeight,
  },
  textSm: {
    fontSize: typography.buttonSmall.fontSize,
    lineHeight: typography.buttonSmall.lineHeight,
  },
  textMd: {
    fontSize: typography.button.fontSize,
    lineHeight: typography.button.lineHeight,
  },
  textLg: {
    fontSize: typography.buttonLarge.fontSize,
    lineHeight: typography.buttonLarge.lineHeight,
  },
  textPrimary: {
    color: colors.dark.primary,
  },
  textSecondary: {
    color: colors.dark.text,
  },
  textDanger: {
    color: "#FFFFFF",
  },
  textOutline: {
    color: colors.dark.text,
  },
  textGhost: {
    color: colors.dark.accent,
  },
  textSuccess: {
    color: "#FFFFFF",
  },

  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: "100%",
  },

  iconOnly: {
    paddingHorizontal: 0,
    width: 44,
    height: 44,
  },
  iconOnlyLg: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
});
