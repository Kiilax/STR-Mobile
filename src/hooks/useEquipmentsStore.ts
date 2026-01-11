import { create } from "zustand";
import { keys } from "@/config";
import { AsyncStore } from "@/utils";
import { Equipment } from "@/types";

interface EquipmentsState {
  equipments: Equipment[];
  setEquipments: (equipments: Equipment[]) => Promise<void>;
  getEquipmentById: (id: number) => Equipment | undefined;
}

export const useEquipmentsStore = create<EquipmentsState>((set, get) => ({
  equipments: [],
  setEquipments: async (equipments) => {
    try {
      set({ equipments });
      await AsyncStore.set(keys.equipments, equipments);
    } catch (err) {
      console.error("Error setting equipments", err);
    }
  },
  getEquipmentById: (id: number): Equipment | undefined => {
    return get().equipments.find((equipment) => equipment.id === id);
  },
}));
