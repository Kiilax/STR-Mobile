import { Coordinates } from "@/types";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export class GoogleMapsService {
  static async getDrivingDistances(
    origin: Coordinates,
    destinations: Coordinates[]
  ): Promise<{ distance: number; duration: number }[]> {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API Key is missing.");
      return destinations.map(() => ({ distance: Infinity, duration: Infinity }));
    }
    
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationsStr = destinations
      .map((d) => `${d.latitude},${d.longitude}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationsStr}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        console.error("Google Maps API Error:", data.status, data.error_message);
         return destinations.map(() => ({ distance: Infinity, duration: Infinity }));
      }

      const elements = data.rows[0].elements;
      
      return elements.map((element: any) => {
        if (element.status === "OK") {
            return {
                distance: element.distance.value,
                duration: element.duration.value
            };
        } else {
            console.warn(`Could not calculate distance for destination: ${element.status}`);
             return { distance: Infinity, duration: Infinity };
        }
      });

    } catch (error) {
      console.error("Failed to fetch distances from Google Maps:", error);
      return destinations.map(() => ({ distance: Infinity, duration: Infinity }));
    }
  }
}
