import { InterestPoint, InterestPointRequest } from "@/types"
import { FileDownloader, ProxyApi } from "@/utils"

const url = "http://10.194.2.127:3000"

export async function fetchInterestPoints(): Promise<InterestPoint[]> {
  const interestPoints = await ProxyApi.get<InterestPoint[]>(url, "/interest-points")
  for (const point of interestPoints) {
    const downloadedImages: string[] = []
    for (const imagePath of point.images) {
      try {
        const localUri = await FileDownloader.download(url + "/files", imagePath)
        if (localUri) downloadedImages.push(localUri)
      } catch (error) {
        console.error(`Failed to download image ${imagePath}:`, error)
      }
      point.images = downloadedImages
      point.synced = true
      point.updated = false
    }
  }
  return interestPoints
}

export async function fetchInterestPointById(id: number) {
  const interestPoint = await ProxyApi.get<InterestPoint>(url, `/interest-points/${id}`)
  interestPoint.synced = true
  return interestPoint
}

export async function createInterestPoint(data: Partial<InterestPointRequest>) {
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

  return ProxyApi.post(url, "/interest-points/single", formData)
}

export async function deleteInterestPoint(id: number) {
  return await ProxyApi.delete(url, `/interest-points/${id}`)
}
