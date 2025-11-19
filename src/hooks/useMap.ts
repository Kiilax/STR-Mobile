import { useEffect, useRef, useState } from "react"
import MapView from "react-native-maps"
import * as Location from "expo-location"
import { STRASBOURG_COORDINATES, USER_DELTA } from "@/src/constants/coordinates"

export function useMap() {
  const mapRef = useRef<MapView | null>(null)
  const [region] = useState(STRASBOURG_COORDINATES)
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setUserLocation(location)
        }
      )
    }
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (isFollowing && userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: USER_DELTA.latitudeDelta,
        longitudeDelta: USER_DELTA.longitudeDelta,
      }
      mapRef.current.animateToRegion(newRegion, 1000)
    }
  }, [isFollowing, userLocation])

  const handleMapDrag = () => {
    if (isFollowing) {
      setIsFollowing(false)
    }
  }

  const handleCenterOnUser = async () => {
    setIsFollowing(true)
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: USER_DELTA.latitudeDelta,
        longitudeDelta: USER_DELTA.longitudeDelta,
      }
      mapRef.current.animateToRegion(newRegion, 1000)
    }
  }

  return {
    mapRef,
    region,
    isFollowing,
    userLocation,
    errorMsg,
    handleMapDrag,
    handleCenterOnUser,
  }
}
