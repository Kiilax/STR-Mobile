import { StyleSheet } from "react-native";
import { colors, typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    width: 280,
    minHeight: 150,
    backgroundColor: colors.dark.secondary,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  loaderContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight as "600",
    lineHeight: typography.h4.lineHeight,
    color: colors.dark.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: typography.bodySmall.fontWeight as "normal",
    lineHeight: typography.bodySmall.lineHeight,
    color: colors.dark.text,
    opacity: 0.7,
    textAlign: "center",
  },
});
