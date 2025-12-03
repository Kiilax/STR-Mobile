import { MainProvider, useMainContext } from "@/context/mainContext"
import { Stack, useRouter } from "expo-router"
import { useEffect } from "react"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import { colors } from "@/constants/theme"

function RootLayoutContent() {
  const { eventId, eventLoading } = useMainContext()
  const router = useRouter()

  useEffect(() => {
    if (eventLoading) return

    if (!eventId) {
      router.replace("/")
    } else {
      router.replace("/(tabs)")
    }
  }, [eventLoading, eventId, router])

  if (eventLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>Stras&apos;ta route</Text>
        <ActivityIndicator size="large" color={colors.dark.tint} />
      </View>
    )
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.dark.text,
  },
})
