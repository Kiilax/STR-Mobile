import { useEffect, useRef, useState, useCallback } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { STRASBOURG_COORDINATES, USER_DELTA } from "@/constants/coordinates";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { Course, Zone } from "@/types";
import { calculateEventBounds } from "@/utils/eventBounds";

export function useMap() {
  const mapRef = useRef<MapView | null>(null);
  const [region] = useState(STRASBOURG_COORDINATES);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { eventData, eventDataLoading } = useEventDataStore();
  const [course, setCourse] = useState<Course[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (eventData && !eventDataLoading) {
      if (eventData.courses) {
        setCourse(eventData.courses);
      }
      if (eventData.zones) {
        setZones(eventData.zones);
      }
    } else if (!eventData) {
      setCourse([]);
      setZones([]);
    }
  }, [eventData, eventDataLoading]);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setUserLocation(location);
        }
      );
    }
    getCurrentLocation();
  }, []);

  const handleMapDrag = () => {
    if (isFollowing) {
      setIsFollowing(false);
    }
  };

  const handleCenterOnUser = async () => {
    setIsFollowing(true);
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: USER_DELTA.latitudeDelta,
        longitudeDelta: USER_DELTA.longitudeDelta,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handleZoomToEvent = useCallback(() => {
    if (eventData && mapRef.current) {
      const bounds = calculateEventBounds(eventData);
      if (bounds) {
        mapRef.current.animateToRegion(bounds, 1000);
      }
    }
  }, [eventData]);

  return {
    zones,
    course,
    mapRef,
    region,
    isFollowing,
    userLocation,
    errorMsg,
    handleMapDrag,
    handleCenterOnUser,
    handleZoomToEvent,
  };
}
