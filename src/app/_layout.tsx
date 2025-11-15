import { ThemeProvider } from "@react-navigation/native"
// import { StyleSheet } from "react-native"
import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "react-native-reanimated"
import Entypo from "@expo/vector-icons/Entypo"
import { colors, darkTheme } from "../constants/theme"
import { SafeAreaView } from "react-native-safe-area-context"
export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark.background }}>
      <ThemeProvider value={darkTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: darkTheme.colors.card },
          }}
        >
          <Tabs.Screen
            name="map/map"
            options={{
              title: "Carte",
              tabBarLabel: "Carte",
              tabBarIcon: ({ color, size }) => <Entypo name="map" size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="points-list/index"
            options={{
              title: "Liste des points",
              tabBarLabel: "Liste",
              tabBarIcon: ({ color, size }) => <Entypo name="list" size={size} color={color} />,
            }}
          />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  )
}
