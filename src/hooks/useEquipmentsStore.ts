import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { Equipment } from "@/types";

interface EquipmentsState {
  equipments: Equipment[];
  setEquipments: (equipments: Equipment[]) => Promise<void>;
}

export const useEquipmentsStore = create<EquipmentsState>((set) => ({
  equipments: [],
  setEquipments: async (equipments) => {
    try {
      set({ equipments });
      await AsyncStore.set(keys.equipments, equipments);
    } catch (err) {
      console.error("Error setting equipments", err);
    }
  },
}));
