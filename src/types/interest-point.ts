import { EquipmentPlacement } from "./equipment"

export interface InterestPoint {
  id: number
  latitude: number
  longitude: number
  comment: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  address?: string
  equipmentPlacements?: EquipmentPlacement[]
}

export interface InterestPointRequest {
  latitude: number
  longitude: number
  comment: string
  images: string[]
}
