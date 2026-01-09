import { EquipmentPlacement } from "@/types";
import { GoogleMapsService } from "@/services/GoogleMapsService";
import { useEffect, useState } from "react";
import * as geolib from "geolib";
import * as Location from "expo-location";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useEventDataStore } from "@/hooks/useEventDataStore";

export function useMarkers({
  userLocation,
}: {
  userLocation: Location.LocationObject | null;
}) {
  const [routeMarkers, setRouteMarkers] = useState<EquipmentPlacement[]>([]);
  const [routeOrigin, setRouteOrigin] =
    useState<Location.LocationObject | null>(null);
  const [nextMarker, setNextMarker] = useState<EquipmentPlacement | null>(null);
  const [distanceNextMarker, setDistanceNextMarker] = useState<number | null>(
    null
  );
  const [lastSortedLocation, setLastSortedLocation] =
    useState<Location.LocationObject | null>(null);
  const [equipmentPlacements, setEquipmentPlacements] = useState<
    EquipmentPlacement[]
  >([]);
  const { interestPoints: interestPointMarkers } = useInterestPointsStore();
  const { eventData, eventDataLoading } = useEventDataStore();

  useEffect(() => {
    if (eventData && !eventDataLoading) {
      setEquipmentPlacements(eventData.equipmentPlacements);
    } else if (!eventData) {
      setEquipmentPlacements([]);
      setRouteMarkers([]);
      setNextMarker(null);
      setDistanceNextMarker(null);
    }
  }, [eventData, eventDataLoading]);

  useEffect(() => {
    if (!userLocation || !equipmentPlacements || !equipmentPlacements.length)
      return;

    const shouldSort =
      !lastSortedLocation ||
      geolib.getDistance(
        { ...userLocation.coords },
        { ...lastSortedLocation.coords }
      ) > 200;

    if (!shouldSort && routeMarkers.length > 0) return;

    const sortMarkers = async () => {
      try {
        const distances = await GoogleMapsService.getDrivingDistances(
          userLocation.coords,
          equipmentPlacements.map((e) => e.coordinates)
        );

        const sorted = equipmentPlacements
          .map((item, index) => ({
            item,
            distance: distances[index].distance,
          }))
          .sort((a, b) => a.distance - b.distance)
          .map((entry) => entry.item);

        setRouteMarkers(sorted);
        setRouteOrigin(userLocation);
        setLastSortedLocation(userLocation);
      } catch (error) {
        console.error("Error sorting markers:", error);
      }
    };

    sortMarkers();
  }, [
    equipmentPlacements,
    lastSortedLocation,
    routeMarkers.length,
    userLocation,
  ]);

  useEffect(() => {
    const getDistanceToUser = (point: EquipmentPlacement) => {
      if (!userLocation) return Infinity;
      return geolib.getDistance(
        { ...userLocation.coords },
        { ...point.coordinates }
      );
    };
    if (!userLocation || !routeMarkers) return;

    let foundNext = null;
    let dist = null;

    for (const marker of routeMarkers) {
      if (!marker.isVisited) {
        foundNext = marker;
        dist = getDistanceToUser(marker);
        break;
      }
    }

    setNextMarker(foundNext);
    setDistanceNextMarker(dist);
  }, [userLocation, routeMarkers]);

  return {
    interestPointMarkers: interestPointMarkers || [],
    routeMarkers: routeMarkers || [],
    routeOrigin,
    nextMarker,
    distanceNextMarker,
  };
}
