import { colors } from "@/src/constants/theme"
import { StyleSheet } from "react-native"
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 40,
    right: 20,
    width: 55,
    height: 55,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
})
