import { colors } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: colors.dark.secondary,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    marginBottom: 16,
  },
  title: {
    color: colors.dark.inverted,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  comment: {
    color: colors.dark.inverted,
    fontSize: 16,
    lineHeight: 22,
  },
  imagesContainer: {
    marginTop: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.dark.secondary,
  },
  section: {
    backgroundColor: colors.dark.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
    shadowColor: colors.dark.inverted,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: colors.dark.inverted,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});