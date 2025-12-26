import { FileDownloader } from "@/utils/fileDownloader"
import { ImageStorage } from "@/utils/imageStorage"
import { fetch } from "expo/fetch"

// Mock expo-file-system usage from jest.setup.js
// Mock expo/fetch usage from jest.setup.js

jest.mock("@/utils/imageStorage", () => ({
  ImageStorage: {
    save: jest.fn(),
  },
}))

describe("FileDownloader", () => {
  const mockFetch = fetch as jest.Mock
  const mockImageStorageSave = ImageStorage.save as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("download", () => {
    it("downloads file and returns local uri", async () => {
      const url = "https://example.com"
      const endpoint = "/file.jpg"
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        bytes: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      }
      mockFetch.mockResolvedValue(mockResponse)
      mockImageStorageSave.mockResolvedValue("file:///saved/image.jpg")

      const result = await FileDownloader.download(url, endpoint)

      expect(mockFetch).toHaveBeenCalledWith(`${url}${endpoint}`)
      expect(mockImageStorageSave).toHaveBeenCalledWith("document/downloadedFile")
      expect(result).toBe("file:///saved/image.jpg")
    })

    it("uses filename from Content-Disposition header", async () => {
      const url = "https://example.com"
      const endpoint = "/file.jpg"
      const mockResponse = {
        ok: true,
        headers: {
          // eslint-disable-next-line
          get: jest.fn().mockReturnValue('attachment; filename="testResponse.jpg"'),
        },
        bytes: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      }
      mockFetch.mockResolvedValue(mockResponse)
      mockImageStorageSave.mockResolvedValue("file:///saved/testResponse.jpg")

      await FileDownloader.download(url, endpoint)

      expect(mockImageStorageSave).toHaveBeenCalledWith("document/testResponse.jpg")
    })

    it("throws error on network failure", async () => {
      mockFetch.mockRejectedValue(new Error("Network Error"))

      await expect(FileDownloader.download("http://site.com", "/img")).rejects.toThrow(
        "Network Error",
      )
    })

    it("throws error on non-ok response", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      }
      mockFetch.mockResolvedValue(mockResponse)

      await expect(FileDownloader.download("http://site.com", "/img")).rejects.toThrow(
        "HTTP 404: Failed to download file",
      )
    })
  })
})
