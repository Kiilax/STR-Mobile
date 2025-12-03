import { EquipmentPlacement } from "./equipment"
import { Coordinates } from "./coordinates"

export interface InterestPoint {
  id: number
  address?: string
  coordinates: Coordinates
  comment?: string
  images: string[]
  isVisited: boolean
  synced: boolean
  updated: boolean
  equipmentPlacements?: EquipmentPlacement[]
  eventIp?: number
  createdAt: Date
  updatedAt: Date
}

export interface InterestPointRequest {
  latitude: number
  longitude: number
  comment: string
  images: string[]
  address?: string
}
