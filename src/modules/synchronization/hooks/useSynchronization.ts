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
import useQRCodeStore from "@/hooks/useQRCodeStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";

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
    overrideEventId?: number,
    overrideTeamId?: string
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
      console.error(
        `Failed to sync interest point ID ${interestPoint.id}:`,
        error
      );
      throw new Error(
        `Échec de la création du point "${interestPoint.comment}". Veuillez réessayer.`
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

  const processPlacements = useCallback(
    (placements: any[]) => {
      return placements.map((placement) => {
        const updatedPlacement = { ...placement };
        updatedPlacement.status = EquipmentStatus.PENDING;

        const equipment = getEquipmentById(updatedPlacement.equipmentId);
        if (equipment?.type === "vehicle") {
          const newCoordinates =
            RectangleCalculator.getVehicleRect(updatedPlacement);
          if (newCoordinates) {
            updatedPlacement.coordinates = newCoordinates;
          } else {
            console.warn(
              `Failed to calculate rectangle for equipmentPlacement ID ${updatedPlacement.id}`
            );
          }
        }
        return updatedPlacement;
      });
    },
    [getEquipmentById]
  );

  const handleReceiveEvent = useCallback(
    async (
      overrideUrl?: string,
      overrideEventId?: number,
      overrideTeamId?: string
    ) => {
      const targetUrl = overrideUrl || url;
      if (!targetUrl) {
        console.warn("Cannot receive event: No URL.");
        return;
      }

      setStatus("syncing");
      setMessage("");
      try {
        const event = await fetchEventById(
          overrideUrl,
          overrideEventId,
          overrideTeamId
        );
        if (event) {
          setStatus("success");
          setMessage("Évènement reçu avec succès");

          let rawPlacements = event.equipmentPlacements;
          const targetTeamId =
            overrideTeamId || useTeamActionsStore.getState().currentTeamId;

          if (targetTeamId && event.teamPlacements) {
            rawPlacements = event.teamPlacements;
          }

          const processedPlacements = processPlacements(rawPlacements);

          setEquipmentPlacements(processedPlacements);
          setEventData(event);
        } else {
          setStatus("error");
          setMessage("Aucun évènement trouvé");
          console.error("No event found");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          `Échec de la synchronisation de l'évènement. Veuillez réessayer.`
        );
        console.error("Failed to receive event:", error);
      }
    },
    [
      url,
      fetchEventById,
      setEquipmentPlacements,
      setEventData,
      processPlacements,
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
    useQRCodeStore.getState().reset();
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
