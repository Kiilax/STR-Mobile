import { useState, useCallback, useEffect } from "react";
import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useInterestPointsApi } from "./useInterestPointsApi";
import { useEventApi } from "./useEventApi";
import { InterestPoint, EquipmentStatus } from "@/types";
import { useEquipmentsStore } from "@/hooks";
import { RectangleCalculator } from "@/utils/rectangleCalculator";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface UseSynchronizationReturn {
  status: SyncStatus;
  message: string;
  hasScannedQR: boolean;
  pointsToSync: number;
  canSync: boolean;
  handleSendInterestPoints: () => Promise<void>;
  handleReceiveEvent: (
    overrideUrl?: string,
    overrideEventId?: number
  ) => Promise<void>;
  handleClearData: (resetTeamActions?: () => Promise<void>) => Promise<void>;
}

export function useSynchronization(): UseSynchronizationReturn {
  const { url } = useUrlStore();
  const { eventId, deleteEventId } = useEventIdStore();
  const { setEventData, deleteEventData } = useEventDataStore();
  const { setEquipmentPlacements, deleteEquipmentPlacements } =
    useEquipmentPlacementStore();
  const { interestPoints, deleteAllInterestPoints } = useInterestPointsStore();
  const { getEquipmentById } = useEquipmentsStore();

  const { create } = useInterestPointsApi();
  const { fetchEventById } = useEventApi();

  const [status, setStatus] = useState<SyncStatus>("idle");
  const [message, setMessage] = useState("");

  const hasScannedQR = !!url && !!eventId;
  const pointsToSync = interestPoints.filter(
    (p) => !p.synced && p.eventId === eventId
  ).length;
  const canSync = hasScannedQR && pointsToSync > 0;

  const syncPoint = async (interestPoint: InterestPoint) => {
    const dataToSend = {
      coordinates: { ...interestPoint.coordinates },
      address: interestPoint.address,
      comment: interestPoint.comment,
      eventId: interestPoint.eventId,
      images: interestPoint.images,
    };

    try {
      await create(dataToSend);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Échec de la création du point "${interestPoint.comment}": ${errorMsg}`
      );
    }
  };

  const handleSendInterestPoints = async () => {
    if (!canSync) return;

    setStatus("syncing");
    setMessage("");

    try {
      for (const interestPoint of interestPoints) {
        if (interestPoint.synced && !interestPoint.updated) {
          continue;
        }

        if (interestPoint.eventId !== eventId) {
          continue;
        }

        try {
          await syncPoint(interestPoint);
        } catch (err: any) {
          setStatus("error");
          setMessage(
            `Erreur: ${err instanceof Error ? err.message : String(err)}`
          );
          return;
        }
      }

      try {
        deleteAllInterestPoints();
      } catch (deleteError) {
        console.error("Failed to delete local points:", deleteError);
        setStatus("error");
        setMessage(`Échec de la suppression des points locaux: ${deleteError}`);
        return;
      }

      setStatus("success");
      setMessage("Points à sécuriser synchronisés avec succès");
    } catch (error: any) {
      setStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setMessage(`Échec de la synchronisation: ${errorMessage}`);
      console.error("Failed to synchronize interest points:", error);
    }
  };

  const handleReceiveEvent = useCallback(
    async (overrideUrl?: string, overrideEventId?: number) => {
      const targetUrl = overrideUrl || url;
      if (!targetUrl) {
        console.warn("Cannot receive event: No URL.");
        return;
      }

      setStatus("syncing");
      setMessage("");
      try {
        const event = await fetchEventById(overrideUrl, overrideEventId);
        if (event) {
          setStatus("success");
          setMessage("Événement reçu avec succès");
          for (const equipmentPlacement of event.equipmentPlacements) {
            equipmentPlacement.status = EquipmentStatus.PENDING;
            const equipment = getEquipmentById(equipmentPlacement.equipmentId);
            if (equipment?.type === "vehicle") {
              const newCoordinates =
                RectangleCalculator.getVehicleRect(equipmentPlacement);
              if (newCoordinates) {
                equipmentPlacement.coordinates = newCoordinates;
              } else {
                console.warn(
                  `Failed to calculate rectangle for equipmentPlacement ID ${equipmentPlacement.id}`
                );
              }
            }
          }
          setEquipmentPlacements(event.equipmentPlacements);
          setEventData(event);
        } else {
          setStatus("error");
          setMessage("Aucun événement trouvé");
          console.error("No event found");
        }
      } catch (error: any) {
        setStatus("error");
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setMessage(`Échec de la réception: ${errorMessage}`);
        console.error("Failed to receive event:", error);
      }
    },
    [
      url,
      fetchEventById,
      setEquipmentPlacements,
      setEventData,
      getEquipmentById,
    ]
  );

  const handleClearData = async (resetTeamActions?: () => Promise<void>) => {
    await deleteEventData();
    await deleteEquipmentPlacements();
    deleteAllInterestPoints();
    if (resetTeamActions) {
      await resetTeamActions();
    }
    await deleteEventId();
    useUrlStore.getState().setUrl("");
    setStatus("idle");
    setMessage("");
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return {
    status,
    message,
    hasScannedQR,
    pointsToSync,
    canSync,
    handleSendInterestPoints,
    handleReceiveEvent,
    handleClearData,
  };
}
