import { Route } from "./route"
import { Geometry } from "./geometry"
import { EquipmentPlacement } from "./equipment"
import { InterestPoint } from "./interestPoint"

export interface Event {
  id: number
  startDate: string
  endDate: string
  title: string
  description: string
  eventRoute: Route
  geometries: Geometry[]
  equipmentPlacements: EquipmentPlacement[]
  interestPoints: InterestPoint[]
  createdAt: string
  updatedAt: string
}
