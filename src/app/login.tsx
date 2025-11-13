import { Link } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>LOGIN</Text>
      <Link href="/(tabs)/map" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 80,
    fontFamily: "Arial",
    color: "#000000",
    fontWeight: "bold",
    marginBottom: 100,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
    elevation: 2,
    textAlign: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
})
