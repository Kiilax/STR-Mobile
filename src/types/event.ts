import { EquipmentPlacement } from "./equipment";
import { InterestPoint } from "./interestPoint";
import { Coordinates } from "./coordinates";
import { Course } from "./course";

export interface Event {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  courses: Course[];
  geometries: Coordinates[][];
  equipmentPlacements: EquipmentPlacement[];
  interestPoints: InterestPoint[];
  createdAt: string;
  updatedAt: string;
}
