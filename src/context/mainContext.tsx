import React, { createContext, useState, useContext, ReactNode } from "react"
import { Equipment, InterestPoint } from "@/types"
import { keys } from "@/config"
import { useReactiveAsyncStore } from "@/hooks"
import { ImageStorage } from "../utils"

type MainContextType = {
  ip: string | null
  setIp: (ip: string) => void

  interestPoints: InterestPoint[]
  setInterestPoints: (points: InterestPoint[]) => void
  addInterestPoint: (point: InterestPoint) => void
  deleteInterestPoint: (id: number) => void
  deleteAllInterestPoints: () => void

  equipments: Equipment[]
  setEquipments: (equipments: Equipment[]) => void

  loading: boolean
  error: Error | null
  refreshInterestPoints: () => Promise<void>
  clearError: () => void
}

const mainContext = createContext<MainContextType | undefined>(undefined)

type MainProviderProps = {
  children: ReactNode
}

export function MainProvider({ children }: MainProviderProps) {
  const [ip, setIp] = useState<string | null>(null)
  const { value, setValue, loading, error, clearError, refresh } = useReactiveAsyncStore<
    InterestPoint[]
  >(keys.interestPoints, [])
  const { value: equipments, setValue: setEquipments } = useReactiveAsyncStore<Equipment[]>(
    keys.equipments,
    []
  )

  function addInterestPoint(point: InterestPoint) {
    setValue((prev) => [...prev, point])
  }
  function deleteInterestPoint(id: number) {
    const interestPoint = value.find((poi) => poi.id === id)
    for (const uri of interestPoint?.images || []) {
      ImageStorage.remove(uri)
    }
    setValue((prev) => prev.filter((poi) => poi.id !== id))
  }

  function deleteAllInterestPoints() {
    for (const interestPoint of value) {
      for (const uri of interestPoint.images) {
        ImageStorage.remove(uri)
      }
    }
    setValue([])
  }

  return (
    <mainContext.Provider
      value={{
        ip,
        interestPoints: value,
        loading,
        equipments,
        setEquipments,
        error,
        setIp,
        setInterestPoints: setValue,
        refreshInterestPoints: refresh,
        addInterestPoint,
        deleteInterestPoint,
        deleteAllInterestPoints,
        clearError,
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
