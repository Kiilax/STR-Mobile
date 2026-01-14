import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  container: {
    width: "85%",
    maxWidth: 340,
    backgroundColor: colors.dark.secondary,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainerError: {
    backgroundColor: "rgba(244, 67, 54, 0.15)",
  },
  iconContainerSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
  },
  iconContainerWarning: {
    backgroundColor: "rgba(255, 193, 7, 0.15)",
  },
  iconContainerInfo: {
    backgroundColor: "rgba(33, 150, 243, 0.15)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: colors.dark.text,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.dark.accent,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttonDanger: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.primary,
  },
  buttonTextSecondary: {
    color: colors.dark.text,
  },
});
