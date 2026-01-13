import { EquipmentPlacement, Course, Zone, InterestPoint } from "@/types";

export interface EventDTO {
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

export interface Event {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  courses: Course[];
  zones: Zone[];
  interestPoints: InterestPoint[];
  createdAt: string;
  updatedAt: string;
}
