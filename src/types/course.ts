import { Coordinates } from "./coordinates";

export interface Course {
  id: number;
  eventId: number;
  name: string;
  route: Coordinates[];
  color: string;
}
