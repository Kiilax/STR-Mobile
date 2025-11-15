import { useEffect, useRef, useState } from "react"
import MapView from "react-native-maps"
import * as Location from "expo-location"

// TODO : Move INITIAL_COORDINATES to a constants file
const INITIAL_COORDINATES = {
  latitude: 48.5734053,
  longitude: 7.7521113,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

export function useMap() {
  const mapRef = useRef<MapView | null>(null)
  const [region, setRegion] = useState(INITIAL_COORDINATES)
  const [isFollowing, setIsFollowing] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Request location permission and get current location
  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      })
    }
    getCurrentLocation()
  }, [])

  const handleMapDrag = () => {
    if (isFollowing) {
      setIsFollowing(false)
    }
  }

  const handleCenterOnUser = () => {
    setIsFollowing(true)

    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        zoom: 18,
      })
    }
  }

  return {
    mapRef,
    region,
    isFollowing,
    errorMsg,
    handleMapDrag,
    handleCenterOnUser,
  }
}
