import { StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: colors.dark.inverted,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.dark.text,
    textAlign: "center",
    lineHeight: 20,
  },
})
