import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: "#4CAF50",
  },
  errorMessage: {
    backgroundColor: "#F44336",
  },
  successText: {
    color: "white",
    fontWeight: "600",
  },
  errorText: {
    color: "white",
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
});
