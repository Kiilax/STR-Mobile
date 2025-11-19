import { Stack } from "expo-router"

export default function InterestPointsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Points d'intérêt" }} />
      <Stack.Screen name="[id]" options={{ title: "Détails" }} />
    </Stack>
  )
}
