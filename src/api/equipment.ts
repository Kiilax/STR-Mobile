import { Equipment } from "../types/"
import { API_URL } from "@/src/config"

export async function fetchEquipements(): Promise<Equipment[]> {
  try {
    const response = await fetch(`${API_URL}/equipments`).then((res) => res.json())

    return response.data
  } catch (error) {
    console.error("Error fetching equipments:", error)
    return []
  }
}

export async function fetchEquipmentById(id: number): Promise<Equipment | null> {
  try {
    const response = await fetch(`${API_URL}/equipments/${id}`).then((res) => res.json())
    return response.data || null
  } catch (error) {
    console.error(`Error fetching equipment with id ${id}:`, error)
    return null
  }
}
