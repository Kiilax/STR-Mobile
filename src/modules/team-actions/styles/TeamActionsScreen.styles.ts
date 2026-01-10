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
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dashboardContainer: {
    flex: 1,
  },
  footerContainer: {
    width: "100%",
    paddingTop: 20,
    gap: 10,
  },
  
  teamHeader: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  teamIcon: {
    marginRight: 12,
  },
  teamTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  teamUrl: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  
  // Stats
  statsContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  
  // Actions Container
  actionsContainer: {
    flex: 1,
  },
  actionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionsTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: colors.dark.tint,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Action Items
  actionsList: {
    paddingBottom: 20,
  },
  actionCard: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dropoffIcon: {
    backgroundColor: "#4CAF50", // Green
  },
  removeIcon: {
    backgroundColor: "#F44336", // Red
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
  },
  actionCompleteIcon: {
    color: '#4CAF50',
  },
  actionHint: {
    color: colors.dark.text,
    fontSize: 11,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  itemSeparator: {
    height: 12,
  },
  
  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.dark.text,
    marginTop: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    color: colors.dark.text,
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    textAlign: "center",
  },
  
  // Buttons
  button: {
    backgroundColor: colors.dark.tint,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: colors.dark.secondary,
    borderWidth: 1,
    borderColor: colors.dark.tint,
  },
  buttonDanger: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  
  infoText: {
    color: colors.dark.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
});