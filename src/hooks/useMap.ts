import { useEffect, useRef, useState } from "react"
import MapView from "react-native-maps"
import * as Location from "expo-location"

// TODO : Move INITIAL_COORDINATES to a constants file
const STRASBOURG_COORDINATES = {
  latitude: 48.5734053,
  longitude: 7.7521113,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

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
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
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
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
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
