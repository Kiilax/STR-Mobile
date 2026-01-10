import { Coordinates } from "./coordinates";

export interface EquipmentPlacement {
  id: number;
  equipmentId: number;
  interestPointId: number;
  quantity: number;
  coordinates: Coordinates[];
  dropOffDate: string;
  removalDate: string;
  createdAt: string;
  updatedAt: string;
  isVisited: boolean;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  length: number;
  width: number;
  height: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}
