import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { Event } from "@/types";

interface EventDataState {
  eventData: Event | null;
  eventDataLoading: boolean;
  eventDataError: Error | null;
  setEventData: (event: Event | null) => Promise<void>;
  deleteEventData: () => Promise<void>;
  refreshEventData: () => Promise<void>;
  clearEventDataError: () => void;
}

export const useEventDataStore = create<EventDataState>((set, get) => ({
  eventData: null,
  eventDataLoading: true,
  eventDataError: null,

  setEventData: async (event: Event | null) => {
    set({ eventDataError: null });
    try {
      set({ eventData: event });
      await AsyncStore.set(keys.eventData, event);
    } catch (err) {
      set({
        eventDataError: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  },

  deleteEventData: async () => {
    set({ eventDataError: null });
    try {
      set({ eventData: null });
      await AsyncStore.remove(keys.eventData);
    } catch (err) {
      console.error("Error removing eventData", err);
    }
  },

  refreshEventData: async () => {
    set({ eventDataLoading: true, eventDataError: null });
    try {
      const data = await AsyncStore.get<Event | null>(keys.eventData, null);
      set({ eventData: data });
    } catch (err) {
      set({
        eventDataError: err instanceof Error ? err : new Error("Unknown error"),
      });
    } finally {
      set({ eventDataLoading: false });
    }
  },

  clearEventDataError: () => set({ eventDataError: null }),
}));
