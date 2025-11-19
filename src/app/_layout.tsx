import { ThemeProvider } from "@react-navigation/native"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import Entypo from "@expo/vector-icons/Entypo"
import { darkTheme } from "@/src/constants/theme"
import { SafeAreaProvider } from "react-native-safe-area-context"
import QRCode from "@/src/components/QRCode"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={darkTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: darkTheme.colors.card },
          }}
        >
          <Tabs.Screen
            name="map/index"
            options={{
              title: "Carte",
              tabBarLabel: "Carte",
              tabBarIcon: ({ color, size }) => <Entypo name="map" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="interest-points"
            options={{
              title: "Points d'intérêt",
              tabBarIcon: ({ color, size }) => <Entypo name="location" size={size} color={color} />,
            }}
          />
        </Tabs>
        <QRCode />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
