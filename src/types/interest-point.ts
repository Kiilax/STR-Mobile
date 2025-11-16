import { EquipmentPlacement } from "./equipment"

export interface InterestPointResponse {
  ok: boolean
  data: InterestPoint[]
}

export interface InterestPoint {
  id: number
  coordinates: number[]
  comment: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  equipmentPlacements: EquipmentPlacement[]
}
