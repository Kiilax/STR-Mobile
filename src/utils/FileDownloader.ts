import { Paths, File } from "expo-file-system"
import { fetch } from "expo/fetch"
import { ImageStorage } from "./ImageStorage"

export class FileDownloader {
  static async download(url: string, endpoint: string) {
    try {
      console.log(`Starting download from ${url}${endpoint}`)
      const response = await fetch(`${url}${endpoint}`)
      console.log(`Download response from ${url}${endpoint}:`, response)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to download file`)
      }

      const contentDisposition = response.headers.get("Content-Disposition")
      let fileName = "downloadedFile"

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/)
        if (match && match[1]) {
          fileName = match[1]
        }
      }
      const file = new File(Paths.document, fileName)
      file.write(await response.bytes())
      return await ImageStorage.save(file.uri)
    } catch (error) {
      console.error("Error downloading file:", error)
      throw error
    }
  }
}
