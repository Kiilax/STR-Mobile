import { EquipmentPlacement } from "./equipment"

export interface InterestPoint {
  id: number
  latitude: number
  longitude: number
  comment: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  isVisited: boolean
  address?: string
  equipmentPlacements?: EquipmentPlacement[]
}

export interface InterestPointRequest {
  latitude: number
  longitude: number
  comment: string
  images: string[]
}
