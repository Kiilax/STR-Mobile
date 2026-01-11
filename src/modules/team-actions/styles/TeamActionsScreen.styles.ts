import { StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background || "#121212",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.9,
  },

  dashboardContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },

  simpleHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  teamTitleLarge: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  listContainer: {
    flex: 1,
  },
  actionsListContent: {
    paddingBottom: 20,
  },

  actionCard: {
    backgroundColor: colors.dark.secondary || "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionCardDone: {
    backgroundColor: "#1E1E1E",
    opacity: 0.7,
    borderColor: "rgba(255,255,255,0.02)",
  },

  actionContentSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dropoffIcon: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  removeIcon: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    color: colors.dark.text || "#CCCCCC",
    fontSize: 13,
    opacity: 0.7,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },

  checkboxContainer: {
    marginLeft: 10,
  },

  footerContainer: {
    padding: 16,
    backgroundColor: colors.dark.background || "#121212",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  mainButton: {
    backgroundColor: colors.dark.tint || "#2196F3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  rescanButton: {
    backgroundColor: colors.dark.secondary || "#333",
    borderWidth: 1,
    borderColor: colors.dark.tint || "#2196F3",
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
});
