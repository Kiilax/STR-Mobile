import { EquipmentPlacement } from "./equipment";
import { Coordinates } from "./coordinates";

export interface InterestPoint {
  id: number;
  coordinates: Coordinates;
  address?: string;
  comment?: string;
  images: string[];
  isVisited: boolean;
  synced: boolean;
  updated: boolean;
  equipmentPlacements?: EquipmentPlacement[];
  eventId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterestPointRequest {
  coordinates: Coordinates;
  address?: string;
  comment?: string;
  images: string[];
  eventId: number;
}
