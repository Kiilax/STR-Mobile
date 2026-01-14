import { Event, Coordinates } from "@/types";

/**
 * Calculate the bounding box of an event based on its zones, courses, and equipment placements
 */
export function calculateEventBounds(event: Event | null): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null {
  if (!event) return null;

  const allCoordinates: Coordinates[] = [];

  // Collect coordinates from zones
  if (event.zones && event.zones.length > 0) {
    event.zones.forEach((zone) => {
      if (zone.coordinates && zone.coordinates.length > 0) {
        allCoordinates.push(...zone.coordinates);
      }
    });
  }

  // Collect coordinates from courses
  if (event.courses && event.courses.length > 0) {
    event.courses.forEach((course) => {
      if (course.route && course.route.length > 0) {
        allCoordinates.push(...course.route);
      }
    });
  }

  // Collect coordinates from interest points
  if (event.interestPoints && event.interestPoints.length > 0) {
    event.interestPoints.forEach((point) => {
      if (point.coordinates) {
        allCoordinates.push(point.coordinates);
      }
    });
  }

  // If no coordinates found, return null
  if (allCoordinates.length === 0) {
    return null;
  }

  // Calculate min/max coordinates
  const latitudes = allCoordinates.map((coord) => coord.latitude);
  const longitudes = allCoordinates.map((coord) => coord.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  // Calculate center and deltas
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Add padding (20% extra space)
  const latDelta = (maxLat - minLat) * 1.2;
  const lngDelta = (maxLng - minLng) * 1.2;

  // Minimum delta to avoid too much zoom
  const minDelta = 0.01;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(latDelta, minDelta),
    longitudeDelta: Math.max(lngDelta, minDelta),
  };
}
