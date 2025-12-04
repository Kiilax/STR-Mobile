import Geocoder from "react-native-geocoding"
import { Coordinates } from "@/types"

/**
 * Convert geographic coordinates (latitude and longitude) to a human-readable address.
 * @param param0 Coordinates object containing latitude and longitude
 * @returns Formatted address string
 */
export async function convertToAddress({ latitude, longitude }: Coordinates) {
  try {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!)
    const json = await Geocoder.from(latitude, longitude)
    return json.results[0].formatted_address
  } catch (error) {
    console.warn("Error in reverse geocoding:", error)
  }
}

/**
 * Convert an address string to geographic coordinates (latitude and longitude).
 * @param address The address to be converted
 * @returns Coordinates object containing latitude and longitude
 */
export async function convertToCoordinates(address: string) {
  try {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!)
    const json = await Geocoder.from(address)
    const location = json.results[0].geometry.location
    return {
      latitude: location.lat,
      longitude: location.lng,
    } as Coordinates
  } catch (error) {
    console.warn("Error in geocoding:", error)
  }
}
