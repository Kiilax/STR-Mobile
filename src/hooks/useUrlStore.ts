import { create } from "zustand";

interface UrlState {
  url: string | null;
  setUrl: (url: string) => void;
}

export const useUrlStore = create<UrlState>((set) => ({
  url: null,
  setUrl: (url) => set({ url }),
}));
