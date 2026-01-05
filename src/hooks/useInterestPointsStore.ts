import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore, ImageStorage } from "@/utils";
import { InterestPoint } from "@/types";

interface InterestPointsState {
  interestPoints: InterestPoint[];
  interestPointsLoading: boolean;
  interestPointsError: Error | null;
  setInterestPoints: (points: InterestPoint[]) => Promise<void>;
  addInterestPoint: (point: InterestPoint) => void;
  deleteInterestPoint: (id: number) => void;
  deleteAllInterestPoints: () => void;
  refreshInterestPoints: () => Promise<void>;
  clearInterestPointsError: () => void;
}

export const useInterestPointsStore = create<InterestPointsState>(
  (set, get) => ({
    interestPoints: [],
    interestPointsLoading: true,
    interestPointsError: null,

    setInterestPoints: async (points) => {
      set({ interestPointsError: null });
      try {
        set({ interestPoints: points });
        await AsyncStore.set(keys.interestPoints, points);
      } catch (err) {
        set({
          interestPointsError:
            err instanceof Error ? err : new Error("Unknown error"),
        });
      }
    },

    addInterestPoint: (point) => {
      const prev = get().interestPoints;
      const next = [...prev, point];
      get().setInterestPoints(next);
    },

    deleteInterestPoint: (id) => {
      const prev = get().interestPoints;
      const pointToDelete = prev.find((p) => p.id === id);
      if (pointToDelete) {
        for (const uri of pointToDelete.images) {
          ImageStorage.remove(uri);
        }
      }
      const next = prev.filter((p) => p.id !== id);
      get().setInterestPoints(next);
    },

    deleteAllInterestPoints: () => {
      const prev = get().interestPoints;
      for (const point of prev) {
        for (const uri of point.images) {
          ImageStorage.remove(uri);
        }
      }
      get().setInterestPoints([]);
    },

    refreshInterestPoints: async () => {
      set({ interestPointsLoading: true, interestPointsError: null });
      try {
        const points = await AsyncStore.get<InterestPoint[]>(
          keys.interestPoints,
          []
        );
        set({ interestPoints: points });
      } catch (err) {
        set({
          interestPointsError:
            err instanceof Error ? err : new Error("Unknown error"),
        });
      } finally {
        set({ interestPointsLoading: false });
      }
    },

    clearInterestPointsError: () => set({ interestPointsError: null }),
  })
);
