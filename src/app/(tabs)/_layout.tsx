import { Tabs } from "expo-router"
import React from "react"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a7ea4",
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="pointsList"
        options={{
          title: "Points d'intérêt",
        }}
      />
    </Tabs>
  )
}
