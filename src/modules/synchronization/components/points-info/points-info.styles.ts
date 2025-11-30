import { StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  pointsAvailable: {
    backgroundColor: "#3d2e1a",
    borderColor: "#FF9800",
  },
  noPoints: {
    backgroundColor: "#1a3d2e",
    borderColor: "#4CAF50",
  },
  pointsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pointsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.inverted,
    marginBottom: 4,
  },
  pointsDescription: {
    fontSize: 14,
    color: colors.dark.text,
    lineHeight: 18,
  },
})