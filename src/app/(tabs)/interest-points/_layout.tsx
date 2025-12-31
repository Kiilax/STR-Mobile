import { useMainContext } from "@/context/mainContext";
import { Stack } from "expo-router";
import { useMemo } from "react";

export default function InterestPointsLayout() {
  const screenOptions = useMemo(() => ({ headerShown: true }), []);
  const { eventData } = useMainContext();
  const title = eventData?.title;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ title: title ? title : "Points d'intérêt" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Détail du point d'intérêt" }}
      />
    </Stack>
  );
}
