import { EquipmentPlacement } from "./equipment";
import { InterestPoint } from "./interestPoint";
import { Coordinates } from "./coordinates";

export interface Event {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  eventRoute: Coordinates[][];
  geometries: Coordinates[][];
  equipmentPlacements: EquipmentPlacement[];
  interestPoints: InterestPoint[];
  createdAt: string;
  updatedAt: string;
}
