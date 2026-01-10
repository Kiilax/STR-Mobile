import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { TeamAction } from "@/types";

export interface LocalTeamAction extends TeamAction {
  done: boolean;
}

interface TeamActionState {
  teamActions: LocalTeamAction[];
  setTeamActionsFromApi: (apiActions: TeamAction[] | TeamAction) => Promise<void>;
  toggleActionDone: (actionId: string) => void;
  resetTeamActions: () => void;
}

export const useTeamActionsStore = create<TeamActionState>((set, get) => ({
  teamActions: [],

  setTeamActionsFromApi: async (apiActions) => {
    try {
      const actionsArray = Array.isArray(apiActions) ? apiActions : [apiActions];

      const localActions: LocalTeamAction[] = actionsArray.map(action => ({
        ...action,
        done: false
      }));

      set({ teamActions: localActions });
      await AsyncStore.set(keys.teamActions, localActions);
    } catch (err) {
      console.error("Error setting team actions", err);
    }
  },

  toggleActionDone: (actionId: string) => {
    set((state) => ({
      teamActions: state.teamActions.map((action) =>
        action.id === actionId ? { ...action, done: !action.done } : action
      ),
    }));
    AsyncStore.set(keys.teamActions, get().teamActions);
  },

  resetTeamActions: async () => {
    set({ teamActions: [] });
    try {
      await AsyncStore.remove(keys.teamActions);
    } catch (e) { console.error(e) }
  }
}));