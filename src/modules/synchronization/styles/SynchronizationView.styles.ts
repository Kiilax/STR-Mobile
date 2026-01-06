import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
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
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "600",
  },
  urlText: {
    color: colors.dark.text,
    fontSize: 14,
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
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDanger: {
    backgroundColor: "#F44336", // Red color
    marginTop: "auto", // Push to bottom if container has flex
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
    marginLeft: 10,
    flex: 1,
  },
  infoText: {
    color: colors.dark.text,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
});
