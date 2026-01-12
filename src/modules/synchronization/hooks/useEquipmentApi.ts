import { useUrlStore } from "@/hooks/useUrlStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { Equipment } from "@/types";
import { FileDownloader, ProxyApi } from "@/utils";
import { useCallback, useState } from "react";

export function useEquipmentApi() {
  const url = useUrlStore((state) => state.url);
  const setEquipments = useEquipmentsStore((state) => state.setEquipments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(
    async (overrideUrl?: string) => {
      setLoading(true);
      setError(null);

      const targetUrl = overrideUrl || url;

      if (!targetUrl || targetUrl.trim() === "") {
        console.warn("URL is not set, cannot fetch equipments");
        setError("IP address is not set");
        setLoading(false);
        return [];
      }
      try {
        const newEquipments = await ProxyApi.get<Equipment[]>(
          targetUrl,
          "/equipments"
        );
        setEquipments([]);
        const finalEquipments = [];
        for (const equip of newEquipments) {
          const localUri = await FileDownloader.download(
            targetUrl + "/files/",
            equip.image
          );
          if (localUri) equip.image = localUri;
          finalEquipments.push(equip);
        }
        setEquipments(finalEquipments);
      } catch (error) {
        console.error("Failed to fetch equipments:", error);
      } finally {
        setLoading(false);
      }
    },
    [url, setEquipments]
  );

  return {
    fetchAll,
    loading,
    error,
  };
}
