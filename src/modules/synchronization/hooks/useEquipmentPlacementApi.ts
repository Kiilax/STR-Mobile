import { useUrlStore } from "@/hooks";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { EquipmentPlacement } from "@/types";
import { ProxyApi } from "@/utils";
import { useCallback, useState } from "react";

export function useEquipmentPlacementApi() {
  const url = useUrlStore((state) => state.url);
  const setEquipmentPlacement = useEquipmentPlacementStore(
    (state) => state.setEquipmentPlacements
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllByTeamId = useCallback(
    async (
      teamId: number,
      overrideUrl?: string
    ): Promise<EquipmentPlacement[] | null> => {
      setLoading(true);
      setError(null);
      const targetUrl = overrideUrl || url;
      if (!targetUrl || targetUrl.trim() === "") {
        console.warn("URL is not set, cannot fetch equipment placements");
        setError("IP address is not set");
        setLoading(false);
        return null;
      }
      try {
        const response = await ProxyApi.get<EquipmentPlacement[]>(
          targetUrl,
          `/equipment-placements?teamId=${teamId}`
        );
        await setEquipmentPlacement(response);
        return response;
      } catch (err) {
        console.error("Failed to fetch equipment placements:", err);
        setError("Failed to fetch equipment placements");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, setEquipmentPlacement]
  );

  return {
    fetchAllByTeamId,
    loading,
    error,
  };
}
