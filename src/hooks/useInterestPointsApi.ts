import { useCallback, useState } from "react"
import { useMainContext } from "../context/mainContext"
import { InterestPoint, InterestPointRequest } from "../types"
import { FileDownloader, ProxyApi } from "@/src/utils"

export function useInterestPointsApi() {
  const { ip, setInterestPoints } = useMainContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (!ip) {
      setError("IP address is not set")
      setLoading(false)
      return []
    }
    try {
      const points = await ProxyApi.get<InterestPoint[]>(ip, "/interest-points")
      console.log(ip + "/files")
      for (const point of points) {
        const downloadedImages: string[] = []
        for (const imagePath of point.images) {
          try {
            const localUri = await FileDownloader.download(ip + "/files/", imagePath)
            if (localUri) downloadedImages.push(localUri)
          } catch (err) {
            console.error(`Failed to download image ${imagePath}:`, err)
          }
        }
        point.images = downloadedImages
      }
      setInterestPoints(points)
      return points
    } catch (err: any) {
      setError(err.message || "Failed to fetch interest points")
      throw err
    } finally {
      setLoading(false)
    }
  }, [ip, setInterestPoints])

  const fetchById = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)
      if (!ip) {
        setError("IP address is not set")
        setLoading(false)
        return []
      }
      try {
        const point = await ProxyApi.get<InterestPoint>(ip, `/interest-points/${id}`)
        return point
      } catch (err: any) {
        setError(err.message || `Failed to fetch interest point with id ${id}`)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [ip]
  )

  const create = useCallback(
    async (data: Partial<InterestPointRequest>) => {
      setLoading(true)
      setError(null)
      if (!ip) {
        setError("IP address is not set")
        setLoading(false)
        return []
      }
      try {
        const formData = new FormData()
        const { images, ...fields } = data

        Object.entries(fields).forEach(([key, value]) => {
          if (value !== undefined) formData.append(key, String(value))
        })

        images?.forEach((uri, index) =>
          formData.append("images", {
            uri,
            type: "image/jpeg",
            name: uri.split("/").pop() || `image-${index}.jpg`,
          } as any)
        )
        console.log("Creating interest point with data:", data)
        const created = await ProxyApi.post(ip, "/interest-points/single", formData)
        return created
      } catch (err: any) {
        setError(err.message || "Failed to create interest point")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [ip]
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    fetchAll,
    fetchById,
    create,
    loading,
    error,
    clearError,
  }
}
