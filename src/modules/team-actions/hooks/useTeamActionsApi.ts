import { useUrlStore } from "@/hooks/useUrlStore";
import { TeamAction } from "@/types";
import { ProxyApi } from "@/utils";
import { useCallback, useState } from "react";

export function useTeamActionsApi(teamId: number, eventId: number) {
  const currentUrl = useUrlStore((state) => state.url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamActions = useCallback(
    async (overrideUrl?: string) => {
      if (!teamId) {
        return null;
      }

      setError(null);
      const targetUrl = overrideUrl || currentUrl;

      if (!targetUrl || targetUrl.trim() === "") {
        return null;
      }

      setLoading(true);
      try {
        const response = await ProxyApi.get<TeamAction[]>(
          targetUrl,
          `/team-actions`,
          { teamId, eventId }
        );
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to fetch team actions");
        return []; 
      } finally {
        setLoading(false);
      }
    },
    [currentUrl, teamId]
  );

  return {
    fetchTeamActions,
    loading,
    error,
  };
}