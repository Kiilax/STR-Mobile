import Geocoder from "react-native-geocoding"

export async function convertToAddress(latitude: number, longitude: number) {
  try {
    Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!)
    const json = await Geocoder.from(latitude, longitude)
    return json.results[0].formatted_address
  } catch (error) {
    console.warn("Error in reverse geocoding:", error)
  }
}
