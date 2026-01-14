import { Event, Coordinates } from "@/types";

export function calculateEventBounds(event: Event | null): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null {
  if (!event) return null;

  const allCoordinates: Coordinates[] = [];

  if (event.zones && event.zones.length > 0) {
    event.zones.forEach((zone) => {
      if (zone.coordinates && zone.coordinates.length > 0) {
        allCoordinates.push(...zone.coordinates);
      }
    });
  }

  if (event.courses && event.courses.length > 0) {
    event.courses.forEach((course) => {
      if (course.route && course.route.length > 0) {
        allCoordinates.push(...course.route);
      }
    });
  }

  if (event.interestPoints && event.interestPoints.length > 0) {
    event.interestPoints.forEach((point) => {
      if (point.coordinates) {
        allCoordinates.push(point.coordinates);
      }
    });
  }

  if (allCoordinates.length === 0) {
    return null;
  }

  const latitudes = allCoordinates.map((coord) => coord.latitude);
  const longitudes = allCoordinates.map((coord) => coord.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  const latDelta = (maxLat - minLat) * 1.2;
  const lngDelta = (maxLng - minLng) * 1.2;

  const minDelta = 0.01;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(latDelta, minDelta),
    longitudeDelta: Math.max(lngDelta, minDelta),
  };
}
