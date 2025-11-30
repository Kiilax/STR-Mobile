import { useMainContext } from "@/context/mainContext";
import { useState } from "react";
import { useInterestPointsApi } from "./useInterestPointsApi";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface UseSynchronizationReturn {
  status: SyncStatus
  message: string
  
  hasScannedQR: boolean
  pointsToSync: number
  canSync: boolean
  
  handleSync: () => Promise<void>
}

export function useSynchronization(): UseSynchronizationReturn {
  const { ip, interestPoints, setInterestPoints, deleteAllInterestPoints } = useMainContext()
  const { fetchAll, create, deleteIP } = useInterestPointsApi()

  const [status, setStatus] = useState<SyncStatus>("idle")
  const [message, setMessage] = useState("")

  const hasScannedQR = !!ip
  const pointsToSyncList = interestPoints.filter((point) => !point.synced || point.updated)
  const pointsToSync = pointsToSyncList.length
  const canSync = hasScannedQR && status !== "syncing"

  const syncPoint = async (interestPoint: typeof interestPoints[0]) => {
    if (!interestPoint.synced && interestPoint.updated) {
      try {
        await deleteIP(interestPoint.id)
        console.log(`Deleted updated point ${interestPoint.id} from server`)
      } catch (error) {
        console.error(`Failed to delete interest point ${interestPoint.id}:`, error)
        throw error
      }
    }

    const dataToSend = {
      comment: interestPoint.comment,
      latitude: interestPoint.latitude,
      longitude: interestPoint.longitude,
      images: interestPoint.images,
    }
    
    await create(dataToSend)
    console.log(`Created/uploaded point: ${interestPoint.comment}`)
  }

  const handleSync = async () => {
    if (!canSync) return

    setStatus("syncing")
    setMessage("")

    try {
      for (const interestPoint of interestPoints) {
        if (interestPoint.synced && !interestPoint.updated) {
          continue
        }
        await syncPoint(interestPoint)
      }

      deleteAllInterestPoints()
      const newPoints = await fetchAll()
      setInterestPoints(newPoints)

      setStatus("success")
      setMessage(
        pointsToSync > 0
          ? "Points d'intérêt synchronisés avec succès"
          : "Données récupérées depuis le serveur"
      )
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