import React, { createContext, useState, useContext, ReactNode } from "react"
import { Equipment, Event, InterestPoint } from "@/types"
import { keys } from "@/config"
import { useReactiveAsyncStore } from "@/hooks"
import { ImageStorage } from "@/utils"

type MainContextType = {
  url: string | null
  setUrl: (url: string) => void
  eventId: number | null
  setEventId: (eventId: number | null) => void
  deleteEventId: () => void
  refreshEventId: () => Promise<void>
  interestPoints: InterestPoint[]
  setInterestPoints: (points: InterestPoint[]) => void
  addInterestPoint: (point: InterestPoint) => void
  deleteInterestPoint: (id: number) => void
  deleteAllInterestPoints: () => void
  eventData: Event | null
  setEventData: (event: Event | null) => void
  deleteEventData: () => void
  refreshEventData: () => Promise<void>
  equipments: Equipment[]
  setEquipments: (equipments: Equipment[]) => void
  eventIdLoading: boolean
  interestPointsLoading: boolean
  eventDataLoading: boolean
  eventIdError: Error | null
  interestPointsError: Error | null
  eventDataError: Error | null
  refreshInterestPoints: () => Promise<void>
  clearInterestPointsError: () => void
  clearEventIdError: () => void
  clearEventDataError: () => void
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
    loading: eventIdLoading,
    error: eventIdError,
    clearError: clearEventIdError,
    refresh: refreshEventId,
  } = useReactiveAsyncStore<number | null>(keys.eventId, null)

  const {
    value: eventData,
    setValue: setEventData,
    loading: eventDataLoading,
    error: eventDataError,
    clearError: clearEventDataError,
    refresh: refreshEventData,
  } = useReactiveAsyncStore<Event | null>(keys.eventData, null)

  const { value: equipments, setValue: setEquipments } = useReactiveAsyncStore<Equipment[]>(
    keys.equipments,
    [],
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

  function deleteEventData() {
    setEventData(null)
  }

  return (
    <mainContext.Provider
      value={{
        url,
        setUrl,
        eventId,
        setEventId,
        deleteEventId,
        refreshEventId,
        interestPoints,
        setInterestPoints,
        refreshInterestPoints,
        addInterestPoint,
        deleteInterestPoint,
        deleteAllInterestPoints,
        deleteEventData,
        eventData,
        setEventData,
        refreshEventData,
        equipments,
        setEquipments,
        eventIdLoading,
        interestPointsLoading,
        eventDataLoading,
        eventIdError,
        interestPointsError,
        eventDataError,
        clearInterestPointsError,
        clearEventIdError,
        clearEventDataError,
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
