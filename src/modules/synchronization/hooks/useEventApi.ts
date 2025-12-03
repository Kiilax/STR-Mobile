import { useMainContext } from "@/context/mainContext"
import { Event } from "@/types"
import { ProxyApi } from "@/utils"
import { useState } from "react"

export function useEventApi() {
  const { eventId } = useMainContext()
  const { url } = useMainContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEventById = async () => {
    setLoading(true)
    setError(null)
    if (!url || url.trim() === "") {
      setError("IP address is not set")
      setLoading(false)
      return null
    }
    try {
      const response: Event = await ProxyApi.get<Event>(url, `/event/${eventId}`)
      console.log("Fetched event:", response)
      return response
    } catch (err: any) {
      setError(err.message || "Failed to fetch event")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchEventById,
    loading,
    error,
  }
}
