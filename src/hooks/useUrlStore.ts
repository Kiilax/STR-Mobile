import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";

interface UrlState {
  url: string | null;
  setUrl: (url: string) => Promise<void>;
  refreshUrl: () => Promise<void>;
}

export const useUrlStore = create<UrlState>((set) => ({
  url: null,
  setUrl: async (url) => {
    set({ url });
    await AsyncStore.set(keys.url, url);
  },
  refreshUrl: async () => {
    try {
      const url = await AsyncStore.get<string | null>(keys.url, null);
      set({ url });
    } catch (err) {
      console.error("Error refreshing url", err);
    }
  },
}));
