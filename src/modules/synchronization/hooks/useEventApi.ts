import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { EventDTO } from "@/types";
import { ProxyApi } from "@/utils";
import { useCallback, useState } from "react";
import { useEquipmentApi } from "./useEquipmentApi";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { useEquipmentPlacementApi } from "./useEquipmentPlacementApi";

export function useEventApi() {
  const currentEventId = useEventIdStore((state) => state.eventId);
  const currentTeamId = useTeamActionsStore((state) => state.currentTeamId);
  const currentUrl = useUrlStore((state) => state.url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchAll } = useEquipmentApi();
  const { fetchAllByTeamId } = useEquipmentPlacementApi();

  const fetchEventById = useCallback(
    async (
      overrideUrl?: string,
      overrideEventId?: number,
      overrideTeamId?: string
    ) => {
      setLoading(true);
      setError(null);

      const targetUrl = overrideUrl || currentUrl;
      const targetEventId = overrideEventId || currentEventId;
      const targetTeamId = overrideTeamId || currentTeamId;

      if (!targetUrl || targetUrl.trim() === "") {
        setError("IP address is not set");
        setLoading(false);
        return null;
      }

      if (!targetEventId) {
        setError("Event ID is not set");
        setLoading(false);
        return null;
      }

      try {
        const response: EventDTO = await ProxyApi.get<EventDTO>(
          targetUrl,
          `/event/${targetEventId}`
        );

        await fetchAll(targetUrl);

        let teamPlacements = null;
        if (targetTeamId) {
          teamPlacements = await fetchAllByTeamId(Number(targetTeamId), targetUrl);
        }

        return { ...response, teamPlacements };
      } catch (err: any) {
        setError(err.message || "Failed to fetch event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUrl, currentEventId, currentTeamId, fetchAll, fetchAllByTeamId]
  );

  return {
    fetchEventById,
    loading,
    error,
  };
}
