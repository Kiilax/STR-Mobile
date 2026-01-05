import { Stack } from "expo-router";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";

export default function InterestPointsLayout() {
  const { interestPoints } = useInterestPointsStore();
  
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: `Points d'intérêt (${interestPoints.length})`,
        }}
      />
      <Stack.Screen name="[id]" options={{ title: "Détails" }} />
    </Stack>
  );
}
