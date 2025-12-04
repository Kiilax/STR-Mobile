import { useCallback, useState } from "react"
import { useMainContext } from "@/context/mainContext"
import { InterestPoint, InterestPointRequest } from "@/types"
import { FileDownloader, ProxyApi } from "@/utils"

export function useInterestPointsApi() {
  const { url } = useMainContext()
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
      const points = await ProxyApi.get<InterestPoint[]>(url, "/interest-points")
      for (const point of points) {
        const downloadedImages: string[] = []
        for (const imagePath of point.images) {
          try {
            const localUri = await FileDownloader.download(url + "/files/", imagePath)
            if (localUri) downloadedImages.push(localUri)
          } catch (err) {
            console.error(`Failed to download image ${imagePath}:`, err)
          }
        }
        point.images = downloadedImages
      }
      return points.map((point) => ({
        ...point,
        synced: true,
      }))
    } catch (err: any) {
      setError(err.message || "Failed to fetch interest points")
      throw err
    } finally {
      setLoading(false)
    }
  }, [url])

  const fetchById = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)
      if (!url) {
        setError("IP address is not set")
        setLoading(false)
        return []
      }
      try {
        const point = await ProxyApi.get<InterestPoint>(url, `/interest-points/${id}`)
        return point
      } catch (err: any) {
        setError(err.message || `Failed to fetch interest point with id ${id}`)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url]
  )

  const create = useCallback(
    async (data: Partial<InterestPointRequest>) => {
      setLoading(true)
      setError(null)
      if (!url) {
        setError("IP address is not set")
        setLoading(false)
        return []
      }
      try {
        const formData = new FormData()
        const { images, coordinates, ...fields } = data

        Object.entries(fields).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, String(value))
        })
        if (coordinates) {
          formData.append("coordinates[longitude]", String(coordinates.longitude))
          formData.append("coordinates[latitude]", String(coordinates.latitude))
        }
        images?.forEach((uri, index) =>
          formData.append("images", {
            uri,
            type: "image/jpeg",
            name: uri.split("/").pop() || `image-${index}.jpg`,
          } as any)
        )
        return await ProxyApi.post(url, "/interest-points/single", formData)
      } catch (err: any) {
        setError(err.message || "Failed to create interest point")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url]
  )

  const deleteIP = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)
      if (!url) {
        setError("IP address is not set")
        setLoading(false)
        return []
      }
      try {
        return await ProxyApi.delete(url, `/interest-points/${id}`)
      } catch (err: any) {
        setError(err.message || `Failed to delete interest point with id ${id}`)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [url]
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    fetchAll,
    fetchById,
    create,
    deleteIP,
    loading,
    error,
    clearError,
  }
}
