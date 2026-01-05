import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";

interface EventIdState {
  eventId: number | null;
  eventIdLoading: boolean;
  eventIdError: Error | null;
  setEventId: (eventId: number | null) => Promise<void>;
  deleteEventId: () => Promise<void>;
  refreshEventId: () => Promise<void>;
  clearEventIdError: () => void;
}

export const useEventIdStore = create<EventIdState>((set, get) => ({
  eventId: null,
  eventIdLoading: true,
  eventIdError: null,

  setEventId: async (id) => {
    set({ eventIdError: null });
    try {
      set({ eventId: id });
      await AsyncStore.set(keys.eventId, id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      set({ eventIdError: error });
      await get().refreshEventId();
    }
  },

  deleteEventId: async () => {
    set({ eventIdError: null });
    try {
      set({ eventId: null });
      await AsyncStore.remove(keys.eventId);
    } catch (err) {
      console.error("Error removing eventId", err);
    }
  },

  refreshEventId: async () => {
    set({ eventIdLoading: true, eventIdError: null });
    try {
      const id = await AsyncStore.get<number | null>(keys.eventId, null);
      set({ eventId: id });
    } catch (err) {
      set({
        eventIdError: err instanceof Error ? err : new Error("Unknown error"),
      });
    } finally {
      set({ eventIdLoading: false });
    }
  },

  clearEventIdError: () => set({ eventIdError: null }),
}));
