import { MainProvider } from "@/context/mainContext"
import { Stack } from "expo-router"

function RootLayoutContent() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <MainProvider>
      <RootLayoutContent />
    </MainProvider>
  )
}
