import { StyleSheet } from "react-native";
import { colors, darkTheme } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  actionsContainer: {
    gap: 12,
  },
  buttonMain: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.tint,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: colors.dark.tint,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    marginRight: 12,
  },
  buttonTextMain: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkTheme.colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  buttonNotVisited: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  buttonVisited: {
    backgroundColor: "#2E7D32", // Green tint for visited
    borderColor: "#2E7D32",
  },
  buttonTextSecondary: {
    marginLeft: 10,
    color: colors.dark.text,
    fontSize: 15,
    fontWeight: "500",
  },
  textVisited: {
    color: "white",
  },
});
