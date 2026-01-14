import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { TeamAction } from "@/types";

export interface LocalTeamAction extends TeamAction {
  done: boolean;
}

interface TeamActionState {
  teamActions: LocalTeamAction[];
  currentTeamId: string | null;
  setTeamActionsFromApi: (
    apiActions: TeamAction[] | TeamAction
  ) => Promise<void>;
  setCurrentTeamId: (teamId: string | null) => Promise<void>;
  toggleActionDone: (actionId: string) => void;
  resetTeamActions: () => Promise<void>;
  refreshTeamActions: () => Promise<void>;
}

export const useTeamActionsStore = create<TeamActionState>((set, get) => ({
  teamActions: [],
  currentTeamId: null,

  setTeamActionsFromApi: async (apiActions) => {
    try {
      const actionsArray = Array.isArray(apiActions)
        ? apiActions
        : [apiActions];

      const localActions: LocalTeamAction[] = actionsArray.map((action) => ({
        ...action,
        done: false,
      }));

      set({ teamActions: localActions });
      await AsyncStore.set(keys.teamActions, localActions);
    } catch (err) {
      console.error("Error setting team actions", err);
    }
  },

  setCurrentTeamId: async (teamId: string | null) => {
    set({ currentTeamId: teamId });
    await AsyncStore.set(keys.currentTeamId, teamId);
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
    set({ teamActions: [], currentTeamId: null });
    try {
      await AsyncStore.remove(keys.teamActions);
      await AsyncStore.remove(keys.currentTeamId);
    } catch (e) {
      console.error(e);
    }
  },

  refreshTeamActions: async () => {
    try {
      const actions = await AsyncStore.get<LocalTeamAction[]>(
        keys.teamActions,
        []
      );
      const teamId = await AsyncStore.get<string | null>(
        keys.currentTeamId,
        null
      );
      set({ teamActions: actions, currentTeamId: teamId });
    } catch (err) {
      console.error("Error refreshing team actions", err);
    }
  },
}));
