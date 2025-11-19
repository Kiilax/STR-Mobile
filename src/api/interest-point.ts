import { create } from "zustand"
import { InterestPoint, InterestPointRequest, InterestPointResponse } from "../types"
import { API_URL } from "@/src/config"

export async function fetchInterestPoints(): Promise<InterestPointResponse> {
  const url = `${API_URL}/interest-points`
  const response = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error fetching interest points:", err)
      throw err
    })

  return response;
}

export async function fetchInterestPointById(id: number): Promise<InterestPoint | null> {
  const url = `${API_URL}/interest-points/${id}`
  const response = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error(`Error fetching interest point with id ${id}:`, err)
      throw err
    })

  return response.data || null
}

export async function createInterestPoint(data: Partial<InterestPointRequest[]>): Promise<InterestPoint> {
  const url = `${API_URL}/interest-points`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const data2 = await response.json()

  return data2
}
