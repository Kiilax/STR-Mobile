import { Stack } from "expo-router"
import { useMemo } from "react"

export default function InterestPointsLayout() {
  const screenOptions = useMemo(() => ({ headerShown: true }), [])

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Points d'intérêt" }} />
      <Stack.Screen name="[id]" options={{ title: "Détails" }} />
    </Stack>
  )
}
