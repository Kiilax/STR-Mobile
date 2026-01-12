import { EquipmentPlacement } from "./equipment";
import { InterestPoint } from "./interestPoint";
import { Coordinates } from "./coordinates";
import { Course } from "./course";

export interface Zone {
  coordinates: Coordinates[];
}

export interface Event {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  courses: Course[];
  zones: Zone[];
  equipmentPlacements: EquipmentPlacement[];
  interestPoints: InterestPoint[];
  createdAt: string;
  updatedAt: string;
}
