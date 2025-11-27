import { Text, View } from "react-native"

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "red", fontSize: 20 }}>404 - Page Not Found</Text>
    </View>
  )
}
