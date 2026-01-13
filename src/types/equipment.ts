import { Coordinates } from "./coordinates";

export enum EquipmentStatus {
  PENDING = "pending",
  DROPPED_OFF = "dropped_off",
  REMOVED = "removed",
}

export interface EquipmentPlacement {
  id: number;
  equipmentId: number;
  interestPointId: number;
  quantity: number;
  coordinates: Coordinates[];
  status: EquipmentStatus;
  dropOffDate: string;
  removalDate: string;
  createdAt: string;
  updatedAt: string;
  isVisited: boolean;
}

export interface Equipment {
  id: number;
  type: string;
  name: string;
  description: string;
  length: number;
  width: number;
  height: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}
