import { useMainContext } from "@/context/mainContext"
import { useState } from "react"
import { useInterestPointsApi } from "./useInterestPointsApi"
import { useEventApi } from "./useEventApi"
import { InterestPoint } from "@/types"

type SyncStatus = "idle" | "syncing" | "success" | "error"

interface UseSynchronizationReturn {
  status: SyncStatus
  message: string
  hasScannedQR: boolean
  pointsToSync: number
  canSync: boolean

  handleSync: () => Promise<void>
}

/**
 * Custom hook to manage synchronization of interest points with a remote server.
 * It handles syncing local changes, fetching new data, and managing sync status.
 *
 * @returns {UseSynchronizationReturn} An object containing sync status, messages, and a sync handler.
 */
export function useSendInterestPoints(): UseSynchronizationReturn {
  const { url, interestPoints, deleteAllInterestPoints } = useMainContext()
  const { create, deleteIP } = useInterestPointsApi()

  const [status, setStatus] = useState<SyncStatus>("idle")
  const [message, setMessage] = useState("")
  const hasScannedQR = !!url
  const pointsToSyncList = interestPoints.filter((point) => !point.synced || point.updated)
  const pointsToSync = pointsToSyncList.length
  const canSync = hasScannedQR && status !== "syncing"

  const syncPoint = async (interestPoint: InterestPoint) => {
    if (!interestPoint.synced && interestPoint.updated) {
      try {
        await deleteIP(interestPoint.id)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        throw new Error(`Échec de la suppression du point ${interestPoint.id}: ${errorMsg}`)
      }
    }

    const dataToSend = {
      coordinates: { ...interestPoint.coordinates },
      address: interestPoint.address,
      comment: interestPoint.comment,
      eventId: interestPoint.eventId,
    }

    try {
      await create(dataToSend)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      throw new Error(`Échec de la création du point "${interestPoint.comment}": ${errorMsg}`)
    }
  }

  const handleSync = async () => {
    if (!canSync) return

    setStatus("syncing")
    setMessage("")

    try {
      console.log(`Starting sync for ${interestPoints.length} total points`)

      for (const interestPoint of interestPoints) {
        if (interestPoint.synced && !interestPoint.updated) {
          console.log(`Skipping point ${interestPoint.id} - already synced and not updated`)
          continue
        }

        try {
          console.log(`Starting sync for point ${interestPoint.id}: ${interestPoint.comment}`)
          await syncPoint(interestPoint)
          console.log(`Successfully synced point ${interestPoint.id}`)
        } catch (pointError) {
          console.error(`Failed to sync point ${interestPoint.id}:`, pointError)
          setStatus("error")
          setMessage(`Échec de la synchronisation du point: ${interestPoint.comment}`)
          return
        }
      }

      console.log("All points synced, deleting local points")
      try {
        deleteAllInterestPoints()
        console.log("Local points deleted successfully")
      } catch (deleteError) {
        console.error("Failed to delete local points:", deleteError)
        setStatus("error")
        setMessage("Échec de la suppression des points locaux")
        return
      }

      setStatus("success")
      setMessage("Points d'intérêt synchronisés avec succès")
    } catch (error) {
      setStatus("error")
      setMessage("Échec de la synchronisation")
      console.error("Failed to synchronize interest points:", error)
    }
  }

  return {
    status,
    message,
    hasScannedQR,
    pointsToSync,
    canSync,
    handleSync,
  }
}

export function useReceiveEvent(): UseSynchronizationReturn {
  const { url, setEventData } = useMainContext()
  const { fetchEventById } = useEventApi()
  const [status, setStatus] = useState<SyncStatus>("idle")
  const [message, setMessage] = useState("")
  const hasScannedQR = !!url
  const canSync = hasScannedQR && status !== "syncing"
  const pointsToSync = 0

  const handleSync = async () => {
    if (!canSync) return
    setStatus("syncing")
    setMessage("")
    try {
      const event = await fetchEventById()
      if (event) {
        setEventData(event)
        setStatus("success")
        setMessage("Événement reçu avec succès")
      } else {
        setStatus("error")
        setMessage("Aucun événement trouvé")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Échec de la réception de l'événement")
      console.error("Failed to receive event:", error)
    }
  }

  return {
    status,
    message,
    hasScannedQR,
    pointsToSync,
    canSync,
    handleSync,
  }
}
