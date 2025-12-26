import { convertToAddress, convertToCoordinates } from "@/utils/addressConverter"
import Geocoder from "react-native-geocoding"

describe("addressConverter", () => {
  const mockGeocoderInit = Geocoder.init as jest.Mock
  const mockGeocoderFrom = Geocoder.from as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("convertToAddress", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      process.env = { ...OLD_ENV, EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: "test-key" }
    })

    afterEach(() => {
      process.env = OLD_ENV
    })

    it("converts coordinates to address successfully", async () => {
      const mockResult = {
        results: [{ formatted_address: "123 Test St, Test City" }],
      }
      mockGeocoderFrom.mockResolvedValue(mockResult)

      const coords = { latitude: 10, longitude: 20 }
      const address = await convertToAddress(coords)

      expect(mockGeocoderInit).toHaveBeenCalled()
      expect(mockGeocoderFrom).toHaveBeenCalledWith(10, 20)
      expect(address).toBe("123 Test St, Test City")
    })

    it("handles errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
      mockGeocoderFrom.mockRejectedValue(new Error("Geocoding failed"))

      const coords = { latitude: 10, longitude: 20 }
      const result = await convertToAddress(coords)

      expect(result).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalledWith("Error in reverse geocoding:", expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe("convertToCoordinates", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      process.env = { ...OLD_ENV, EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: "test-key" }
    })

    afterEach(() => {
      process.env = OLD_ENV
    })

    it("converts address to coordinates successfully", async () => {
      const mockResult = {
        results: [
          {
            geometry: {
              location: { lat: 10, lng: 20 },
            },
          },
        ],
      }
      mockGeocoderFrom.mockResolvedValue(mockResult)

      const address = "123 Test St"
      const coords = await convertToCoordinates(address)

      expect(mockGeocoderInit).toHaveBeenCalled()
      expect(mockGeocoderFrom).toHaveBeenCalledWith(address)
      expect(coords).toEqual({ latitude: 10, longitude: 20 })
    })

    it("handles errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
      mockGeocoderFrom.mockRejectedValue(new Error("Geocoding failed"))

      const address = "Invalid Address"
      const result = await convertToCoordinates(address)

      expect(result).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalledWith("Error in geocoding:", expect.any(Error))
      consoleSpy.mockRestore()
    })
  })
})
