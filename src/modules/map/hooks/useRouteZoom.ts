import { useEffect, useRef } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { InterestPoint } from "@/types";

interface UseRouteZoomProps {
  mapRef: React.RefObject<MapView | null>;
  selectedPoint: InterestPoint | null;
  userLocation: Location.LocationObject | null;
}

export function useRouteZoom({
  mapRef,
  selectedPoint,
  userLocation,
}: UseRouteZoomProps) {
  const hasZoomedRef = useRef<number | null>(null);

  useEffect(() => {
    if (mapRef.current && selectedPoint && userLocation) {
      if (hasZoomedRef.current === selectedPoint.id) {
        return;
      }

      hasZoomedRef.current = selectedPoint.id;

      const coordinates = [
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        {
          latitude: selectedPoint.coordinates.latitude,
          longitude: selectedPoint.coordinates.longitude,
        },
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [mapRef, selectedPoint, userLocation]);

  useEffect(() => {
    if (!selectedPoint) {
      hasZoomedRef.current = null;
    }
  }, [selectedPoint]);
}
