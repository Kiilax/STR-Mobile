import { Stack } from "expo-router";
import { useEffect } from "react";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { useUrlStore } from "@/hooks/useUrlStore";
import { AsyncStore } from "@/utils";
import { keys } from "@/config";
import { Equipment } from "@/types";

function RootLayoutContent() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    useEventIdStore.getState().refreshEventId();
    useEventDataStore.getState().refreshEventData();
    useInterestPointsStore.getState().refreshInterestPoints();
    useEquipmentPlacementStore.getState().refreshEquipmentPlacements();
    useTeamActionsStore.getState().refreshTeamActions();
    useUrlStore.getState().refreshUrl();

    AsyncStore.get<Equipment[]>(keys.equipments, []).then((eq) => {
      useEquipmentsStore.getState().setEquipments(eq);
    });
  }, []);

  return <RootLayoutContent />;
}
