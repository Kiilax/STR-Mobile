import { DefaultTheme, ThemeProvider } from "@react-navigation/native"
// import { StyleSheet } from "react-native"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="map/map"
          options={{
            title: "Carte",
            tabBarLabel: "Carte",
          }}
        />
        <Tabs.Screen
          name="points-list/index"
          options={{
            title: "Liste des points",
            tabBarLabel: "Liste",
          }}
        />
        <Tabs.Screen
          name="qr-scan/index"
          options={{
            title: "Scanner QR Code",
            tabBarLabel: "Scanner",
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
// })
