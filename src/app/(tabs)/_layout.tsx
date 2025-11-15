import { Tabs } from "expo-router"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a7ea4",
      }}
    >
      <Tabs.Screen
        name="map/map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="interest-points/interestPointList"
        options={{
          title: "Points d'intérêt",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="place" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
