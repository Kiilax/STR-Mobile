import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { Event } from "@/types";
import { ProxyApi } from "@/utils";
import { useCallback, useState } from "react";
import { useEquipmentApi } from "./useEquipmentApi";

export function useEventApi() {
  const currentEventId = useEventIdStore((state) => state.eventId);
  const currentUrl = useUrlStore((state) => state.url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchAll } = useEquipmentApi();

  const fetchEventById = useCallback(
    async (overrideUrl?: string, overrideEventId?: number) => {
      setLoading(true);
      setError(null);
      
      const targetUrl = overrideUrl || currentUrl;
      const targetEventId = overrideEventId || currentEventId;

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
        const response: Event = await ProxyApi.get<Event>(
          targetUrl,
          `/event/${targetEventId}`
        );
        await fetchAll();
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to fetch event");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUrl, currentEventId, fetchAll]
  );

  return {
    fetchEventById,
    loading,
    error,
  };
}
