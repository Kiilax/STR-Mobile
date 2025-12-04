import { StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  disabledSyncCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.dark.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3440",
    borderStyle: "dashed",
  },
  disabledSyncText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 12,
  },
})
