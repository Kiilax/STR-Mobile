import { ThemeProvider } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Entypo from "@expo/vector-icons/Entypo";
import { darkTheme } from "@/constants/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";

export default function TabNav() {
  const { eventData } = useEventDataStore();
  const { eventId } = useEventIdStore();

  const getTitle = () => {
    if (eventData?.title) {
      return `Évènement : ${eventData.title}`;
    }
    if (eventId && !eventData) {
      return "Évènement : Chargement...";
    }
    return "Évènement : Aucun";
  };

  const headerTitle = getTitle();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={darkTheme}>
        <Tabs
          screenOptions={{
            tabBarStyle: { backgroundColor: darkTheme.colors.card },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerShown: true,
              title: headerTitle,
              tabBarLabel: "Carte",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="map" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="interest-points"
            options={{
              headerShown: true,
              title: headerTitle,
              tabBarLabel: "Points à sécuriser",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="location" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="synchronization"
            options={{
              headerShown: true,
              title: headerTitle,
              tabBarLabel: "Évènement",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="calendar" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="teamActions"
            options={{
              headerShown: false,
              title: headerTitle,
              tabBarLabel: "Planning",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="list" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
