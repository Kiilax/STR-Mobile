import { AsyncStore } from "@/utils/asyncStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Keys } from "@config/index"

describe("AsyncStore", () => {
  const mockGetItem = AsyncStorage.getItem as jest.Mock
  const mockSetItem = AsyncStorage.setItem as jest.Mock
  const mockRemoveItem = AsyncStorage.removeItem as jest.Mock
  const mockClear = AsyncStorage.clear as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("get", () => {
    it("returns parsed value when item exists", async () => {
      const mockValue = { foo: "bar" }
      mockGetItem.mockResolvedValue(JSON.stringify(mockValue))

      const key = "testKey" as Keys
      const result = await AsyncStore.get(key, null)

      expect(mockGetItem).toHaveBeenCalledWith(key)
      expect(result).toEqual(mockValue)
    })

    it("returns default value when item does not exist", async () => {
      mockGetItem.mockResolvedValue(null)

      const key = "testKey" as Keys
      const defaultValue = { default: "value" }
      const result = await AsyncStore.get(key, defaultValue)

      expect(mockGetItem).toHaveBeenCalledWith(key)
      expect(result).toEqual(defaultValue)
    })

    it("returns default value on error", async () => {
      mockGetItem.mockRejectedValue(new Error("Storage error"))

      const key = "testKey" as Keys
      const defaultValue = "default"
      const result = await AsyncStore.get(key, defaultValue)

      expect(result).toBe(defaultValue)
    })
  })

  describe("set", () => {
    it("saves stringified value", async () => {
      const key = "testKey" as Keys
      const value = { foo: "bar" }

      await AsyncStore.set(key, value)

      expect(mockSetItem).toHaveBeenCalledWith(key, JSON.stringify(value))
    })

    it("handles errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
      mockSetItem.mockRejectedValue(new Error("Storage error"))

      const key = "testKey" as Keys
      const value = "value"

      await AsyncStore.set(key, value)

      expect(consoleSpy).toHaveBeenCalledWith(
        `AsyncStore.set error for key "${key}":`,
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe("update", () => {
    it("updates value correctly", async () => {
      const key = "testKey" as Keys
      const initialValue = { count: 1 }
      mockGetItem.mockResolvedValue(JSON.stringify(initialValue))

      const updater = (prev: typeof initialValue) => ({ count: prev.count + 1 })
      const result = await AsyncStore.update(key, initialValue, updater)

      expect(mockGetItem).toHaveBeenCalledWith(key)
      expect(mockSetItem).toHaveBeenCalledWith(key, JSON.stringify({ count: 2 }))
      expect(result).toEqual({ count: 2 })
    })
  })

  describe("remove", () => {
    it("removes item", async () => {
      const key = "testKey" as Keys
      await AsyncStore.remove(key)
      expect(mockRemoveItem).toHaveBeenCalledWith(key)
    })
  })

  describe("clear", () => {
    it("clears storage", async () => {
      await AsyncStore.clear()
      expect(mockClear).toHaveBeenCalled()
    })
  })
})
