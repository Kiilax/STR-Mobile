import { EquipmentPlacement, EquipmentStatus } from "@/types";
import { keys } from "@/config";
import { create } from "zustand";
import { AsyncStore } from "@/utils";

interface EquipmentPlacementState {
  equipmentPlacements: EquipmentPlacement[];
  setEquipmentPlacements: (placements: EquipmentPlacement[]) => Promise<void>;
  getEquipmentPlacementById: (id: number) => EquipmentPlacement | undefined;
  setEquipmentStatus: (id: number, status: EquipmentStatus) => Promise<void>;
  deleteEquipmentPlacements: () => Promise<void>;
}

export const useEquipmentPlacementStore = create<EquipmentPlacementState>(
  (set, get) => ({
    equipmentPlacements: [],
    setEquipmentPlacements: async (placements) => {
      try {
        set({ equipmentPlacements: placements });
        await AsyncStore.set(keys.equipmentPlacements, placements);
      } catch (err) {
        console.error("Error setting equipment placements", err);
      }
    },
    getEquipmentPlacementById: (id: number): EquipmentPlacement | undefined => {
      return get().equipmentPlacements.find((placement) => placement.id === id);
    },
    setEquipmentStatus: async (id, status) => {
      const currentPlacements = get().equipmentPlacements;
      const updatedPlacements = currentPlacements.map((p) =>
        p.id === id ? { ...p, status } : p
      );
      set({ equipmentPlacements: updatedPlacements });
    },
    deleteEquipmentPlacements: async () => {
      try {
        set({ equipmentPlacements: [] });
        await AsyncStore.remove(keys.equipmentPlacements);
      } catch (err) {
        console.error("Error deleting equipment placements", err);
      }
    },
  })
);
