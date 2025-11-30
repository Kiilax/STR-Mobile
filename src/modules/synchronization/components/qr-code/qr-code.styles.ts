import { StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
  },
  scanButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanButtonText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  scanButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  scanButtonSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scanResult: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  scanSuccessHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scanSuccessIcon: {
    marginRight: 12,
  },
  scanSuccessText: {
    flex: 1,
  },
  scanSuccessTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  scanSuccessSubtitle: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  ipContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  ipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  ipValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ipValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
    flex: 1,
    marginRight: 12,
  },
  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  rescanText: {
    fontSize: 12,
    color: colors.dark.tint,
    fontWeight: "500",
    marginLeft: 4,
  },
})
