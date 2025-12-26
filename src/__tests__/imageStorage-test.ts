import { ImageStorage } from "@/utils/imageStorage"
import { File, Directory, Paths } from "expo-file-system"

describe("ImageStorage", () => {
  const MockFile = jest.mocked(File)
  const MockDirectory = jest.mocked(Directory)

  beforeEach(() => {
    jest.clearAllMocks()
    MockFile.mockClear()
    MockDirectory.mockClear()
  })

  describe("save", () => {
    it("moves file to document directory and returns new uri", async () => {
      const mockMove = jest.fn()
      const mockUri = "file:///original/path/image.jpg"
      
      MockFile.mockImplementation((uri) => ({
        uri: uri,
        move: mockMove,
      } as any))
      
      MockDirectory.mockImplementation((path) => ({
        uri: path,
      } as any))

      const result = await ImageStorage.save(mockUri)

      expect(MockFile).toHaveBeenCalledWith(mockUri)
      expect(MockDirectory).toHaveBeenCalledWith(Paths.document)
      expect(mockMove).toHaveBeenCalledWith(expect.any(Object))
      expect(result).toBe(mockUri)
    })

    it("returns null on error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      MockFile.mockImplementation(() => {
        throw new Error("Move failed")
      })

      const result = await ImageStorage.save("file://test.jpg")

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith("Error saving image to persistent storage:", expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe("remove", () => {
    it("deletes file if it exists", async () => {
      const mockDelete = jest.fn()
      MockFile.mockImplementation((uri) => ({
        exists: true,
        delete: mockDelete,
      } as any))

      const uri = "file:///test/image.jpg"
      const result = ImageStorage.remove(uri)

      expect(MockFile).toHaveBeenCalledWith(uri)
      expect(mockDelete).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it("does nothing if file does not exist", async () => {
      const mockDelete = jest.fn()
      MockFile.mockImplementation((uri) => ({
        exists: false,
        delete: mockDelete,
      } as any))

      const result = ImageStorage.remove("file://test.jpg")

      expect(mockDelete).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("returns false on error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      MockFile.mockImplementation(() => {
        throw new Error("Delete failed")
      })

      const result = ImageStorage.remove("file://test.jpg")

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith("Error removing image from persistent storage:", expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})
