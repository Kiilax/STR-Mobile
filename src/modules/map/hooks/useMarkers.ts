import { EquipmentPlacement } from "@/types";
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
    const sorted = [...equipmentPlacements].sort((a, b) => {
      const distA = geolib.getDistance(
        { ...userLocation.coords },
        { ...a.coordinates }
      );
      const distB = geolib.getDistance(
        { ...userLocation.coords },
        { ...b.coordinates }
      );
      return distA - distB;
    });
    setRouteMarkers(sorted);
    setRouteOrigin(userLocation);
  }, [equipmentPlacements, userLocation]);

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
