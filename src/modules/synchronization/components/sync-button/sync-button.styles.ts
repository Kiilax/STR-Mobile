import { StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  syncButton: {
    backgroundColor: colors.dark.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: colors.dark.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  syncButtonDisabled: {
    backgroundColor: "#3a3a3a",
    shadowOpacity: 0,
  },
  syncButtonText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})
