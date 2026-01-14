import { StyleSheet } from "react-native";
import { colors, typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  centerContent: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  footerContainer: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: "auto",
    gap: 10,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    lineHeight: typography.h2.lineHeight,
    color: colors.dark.text,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  card: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  connectedText: {
    color: colors.dark.tint,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    marginBottom: 16,
    fontWeight: typography.label.fontWeight as "600",
  },
  urlText: {
    color: colors.dark.text,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontFamily: "monospace",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark.tint,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    marginBottom: 12,
    gap: 10,
  },
  buttonSecondary: {
    backgroundColor: colors.dark.secondary,
    borderWidth: 1,
    borderColor: colors.dark.tint,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight as "600",
    lineHeight: typography.button.lineHeight,
  },
  buttonDanger: {
    backgroundColor: "#F44336",
    marginTop: "auto",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  successStatus: {
    backgroundColor: "#4CAF50",
  },
  errorStatus: {
    backgroundColor: "#F44336",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    marginLeft: 10,
    flex: 1,
  },
  infoText: {
    color: colors.dark.text,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight as "600",
    lineHeight: typography.h4.lineHeight,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9,
  },
  rescanButton: {
    marginTop: 12,
  },
  icon: {
    opacity: 0.5,
    marginBottom: 24,
  },
  pointsCountContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  pointsCountText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  pointsLabelText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
});
