import { EquipmentPlacement } from "./equipment"

export interface InterestPointResponse {
  ok: boolean
  data: InterestPoint[]
}

export interface InterestPoint {
  id: number
  latitude: number
  longitude: number
  comment: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  equipmentPlacements: EquipmentPlacement[]
}

export interface InterestPointRequest {
  latitude: number
  longitude: number
  comment: string
}