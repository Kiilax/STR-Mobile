import { StyleSheet, Platform } from "react-native"
import { colors } from "@/constants/theme"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    color: colors.dark.text,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.inverted,
    width: "100%",
  },

  btnCancel: {
    backgroundColor: "#ff4444",
  },

  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: colors.dark.inverted,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    color: colors.dark.inverted,
    marginTop: 20,
    marginBottom: 20,
  },
  camStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  cameraSquare: {
    width: Platform.OS === "web" ? 400 : 300,
    height: Platform.OS === "web" ? 400 : 300,
  },
})
