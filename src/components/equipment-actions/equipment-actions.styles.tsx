import { StyleSheet } from "react-native";
import { colors, darkTheme, typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as "600",
    lineHeight: typography.h3.lineHeight,
    color: colors.dark.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    color: "rgba(255, 255, 255, 0.6)",
  },
  actionsContainer: {
    gap: 12,
  },
  buttonMain: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.tint,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: colors.dark.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 12,
  },
  buttonTextMain: {
    flex: 1,
    color: "white",
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as "600",
    lineHeight: typography.button.lineHeight,
  },
  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkTheme.colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  buttonNotVisited: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  buttonVisited: {
    backgroundColor: "#2E7D32", // Green tint for visited
    borderColor: "#2E7D32",
  },
  buttonTextSecondary: {
    marginLeft: 10,
    color: colors.dark.text,
    fontSize: typography.body.fontSize,
    fontWeight: typography.labelSmall.fontWeight as "500",
    lineHeight: typography.body.lineHeight,
  },
  textVisited: {
    color: "white",
  },
});
