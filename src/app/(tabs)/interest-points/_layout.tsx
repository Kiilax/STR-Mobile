import { Stack } from "expo-router"
import { useMemo } from "react"

export default function InterestPointsLayout() {
  const screenOptions = useMemo(() => ({ headerShown: true }), [])

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="interest-points" options={{ title: "Points d'intérêt" }} />
      <Stack.Screen name="[id]" options={{ title: "Détail du point d'intérêt" }} />
    </Stack>
  )
}
