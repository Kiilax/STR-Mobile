import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { TeamAction } from "@/types";

interface TeamActionState {
  teamActions: TeamAction[];
  setTeamActions: (teamActions: TeamAction[]) => Promise<void>;
}

export const useTeamActionsStore = create<TeamActionState>((set) => ({
  teamActions: [],
  setTeamActions: async (teamActions) => {
    try {
      set({ teamActions });
      await AsyncStore.set(keys.teamActions, teamActions);
    } catch (err) {
      console.error("Error setting team actions", err);
    }
  },
  deleteTeamActions: async () => {
    try {
      await AsyncStore.remove(keys.teamActions);
    } catch (err) {
      console.error("Error removing team Actions", err);
    }
  },
}));
