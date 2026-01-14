import { StyleSheet, Platform } from "react-native";
import { colors, typography } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight as "600",
    lineHeight: typography.h3.lineHeight,
    color: colors.dark.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.dark.text,
    marginTop: 16,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as "bold",
    lineHeight: typography.h2.lineHeight,
    color: colors.dark.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.dark.accent,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    textAlign: "center",
    marginTop: 12,
  },
  instructionText: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    paddingTop: 20,
    color: colors.dark.text,
    textAlign: "center",
    marginBottom: 30,
  },
  cameraContainer: {
    alignItems: "center",
    position: "relative",
    alignSelf: "center",
    width: "100%",
    padding: 20,
  },
  camera: {
    width: Platform.OS === "web" ? 350 : 280,
    height: Platform.OS === "web" ? 350 : 280,
    borderRadius: 16,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: Platform.OS === "web" ? 350 : 280,
    height: Platform.OS === "web" ? 350 : 280,
    borderWidth: 2,
    borderColor: colors.dark.tint,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
});
