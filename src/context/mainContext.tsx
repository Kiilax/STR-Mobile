import React, { createContext, useState, useContext, ReactNode } from "react"
import { Equipment, InterestPoint } from "@/types"
import { keys } from "@/config"
import { useReactiveAsyncStore } from "@/hooks"
import { ImageStorage } from "@/utils"

type MainContextType = {
  url: string | null
  setUrl: (url: string) => void
  eventId: number | null
  setEventId: (eventId: number | null) => void
  deleteEventId: () => void
  refreshEvent: () => Promise<void>
  interestPoints: InterestPoint[]
  setInterestPoints: (points: InterestPoint[]) => void
  addInterestPoint: (point: InterestPoint) => void
  deleteInterestPoint: (id: number) => void
  deleteAllInterestPoints: () => void
  equipments: Equipment[]
  setEquipments: (equipments: Equipment[]) => void
  eventLoading: boolean
  interestPointsLoading: boolean
  eventError: Error | null
  interestPointsError: Error | null
  refreshInterestPoints: () => Promise<void>
  clearInterestPointsError: () => void
  clearEventError: () => void
}

const mainContext = createContext<MainContextType | undefined>(undefined)

type MainProviderProps = {
  children: ReactNode
}

export function MainProvider({ children }: MainProviderProps) {
  const [url, setUrl] = useState<string | null>(null)
  const {
    value: interestPoints,
    setValue: setInterestPoints,
    loading: interestPointsLoading,
    error: interestPointsError,
    clearError: clearInterestPointsError,
    refresh: refreshInterestPoints,
  } = useReactiveAsyncStore<InterestPoint[]>(keys.interestPoints, [])
  const {
    value: eventId,
    setValue: setEventId,
    loading: eventLoading,
    error: eventError,
    clearError: clearEventError,
    refresh: refreshEvent,
  } = useReactiveAsyncStore<number | null>(keys.eventId, null)
  const { value: equipments, setValue: setEquipments } = useReactiveAsyncStore<Equipment[]>(
    keys.equipments,
    []
  )

  function deleteEventId() {
    setEventId(null)
  }

  function addInterestPoint(point: InterestPoint) {
    setInterestPoints((prev) => [...prev, point])
  }

  function deleteInterestPoint(id: number) {
    const interestPoint = interestPoints.find((poi) => poi.id === id)
    for (const uri of interestPoint?.images || []) {
      ImageStorage.remove(uri)
    }
    setInterestPoints((prev) => prev.filter((poi) => poi.id !== id))
  }

  function deleteAllInterestPoints() {
    for (const interestPoint of interestPoints) {
      for (const uri of interestPoint.images) {
        ImageStorage.remove(uri)
      }
    }
    setInterestPoints([])
  }

  return (
    <mainContext.Provider
      value={{
        url,
        setUrl,
        eventId,
        setEventId,
        deleteEventId,
        refreshEvent,
        interestPoints,
        setInterestPoints,
        refreshInterestPoints,
        addInterestPoint,
        deleteInterestPoint,
        deleteAllInterestPoints,
        equipments,
        setEquipments,
        eventLoading,
        interestPointsLoading,
        eventError,
        interestPointsError,
        clearInterestPointsError,
        clearEventError,
      }}
    >
      {children}
    </mainContext.Provider>
  )
}

export const useMainContext = (): MainContextType => {
  const context = useContext(mainContext)
  if (!context) throw new Error("useMainContext must be used within MainProvider")
  return context
}
