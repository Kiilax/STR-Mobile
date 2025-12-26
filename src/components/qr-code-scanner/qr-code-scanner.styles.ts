import { StyleSheet, Platform } from "react-native";
import { colors } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    justifyContent: "flex-start",
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
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.dark.text,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.dark.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    color: colors.dark.accent,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  instructionText: {
    fontSize: 13,
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
