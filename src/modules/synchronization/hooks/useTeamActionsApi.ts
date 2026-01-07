import { useUrlStore } from "@/hooks/useUrlStore";
import { TeamAction } from "@/types";
import { ProxyApi } from "@/utils";
import { useCallback, useState } from "react";

export function useTeamActionsApi(teamId : number) {
  const currentUrl = useUrlStore((state) => state.url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamActions = useCallback(
    async (overrideUrl?: string) => {
      setError(null);

      const targetUrl = overrideUrl || currentUrl;

      if (!targetUrl || targetUrl.trim() === "") {
        setError("IP address is not set");
        setLoading(false);
        return null;
      }

      try {
        const response: TeamAction = await ProxyApi.get<TeamAction>(
          targetUrl,
          `/team-actions/${teamId}`
        );
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to fetch team actions");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUrl]
  );

  return {
    fetchTeamActions,
    loading,
    error,
  };
}
