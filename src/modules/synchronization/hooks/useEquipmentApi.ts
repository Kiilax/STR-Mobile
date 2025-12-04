import { useMainContext } from "@/context/mainContext"
import { Equipment } from "@/types"
import { FileDownloader, ProxyApi } from "@/utils"
import { useCallback, useState } from "react"

export function useEquipmentApi() {
  const { url, setEquipments } = useMainContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (!url || url.trim() === "") {
      setError("IP address is not set")
      setLoading(false)
      return []
    }
    try {
      const newEquipments = await ProxyApi.get<Equipment[]>(url, "/equipments")
      setEquipments([])
      const finalEquipments = []
      for (const equip of newEquipments) {
        const localUri = await FileDownloader.download(url + "/files/", equip.image)
        if (localUri) equip.image = localUri
        finalEquipments.push(equip)
      }
      setEquipments(finalEquipments)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [url, setEquipments])

  return {
    fetchAll,
    loading,
    error,
  }
}
