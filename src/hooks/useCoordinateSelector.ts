import { useState, useRef, useEffect, useCallback } from "react"
import { Alert } from "react-native"
import MapView from "react-native-maps"
import * as Location from "expo-location"
import { Coordinates } from "@/src/types"
import { STRASBOURG_COORDINATES, USER_DELTA } from "@/src/constants/coordinates"

interface UseCoordinateSelectorProps {
  coordinates: Coordinates
  onCoordinatesChange: (coords: Coordinates) => void
}

export function useCoordinateSelector({
  coordinates,
  onCoordinatesChange,
}: UseCoordinateSelectorProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [region, setRegion] = useState({
    latitude: coordinates[0] || STRASBOURG_COORDINATES.latitude,
    longitude: coordinates[1] || STRASBOURG_COORDINATES.longitude,
    latitudeDelta: STRASBOURG_COORDINATES.latitudeDelta,
    longitudeDelta: STRASBOURG_COORDINATES.longitudeDelta,
  })
  const mapRef = useRef<MapView>(null)
  const onCoordinatesChangeRef = useRef(onCoordinatesChange)

  // Maintenir la ref à jour
  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange
  }, [onCoordinatesChange])

  const getCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès à la localisation est nécessaire.")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const coords: Coordinates = [location.coords.latitude, location.coords.longitude]

      const newRegion = {
        latitude: coords[0],
        longitude: coords[1],
        latitudeDelta: USER_DELTA.latitudeDelta,
        longitudeDelta: USER_DELTA.longitudeDelta,
      }

      setRegion(newRegion)
      onCoordinatesChangeRef.current(coords)

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000)
      }
    } catch {
      Alert.alert("Erreur", "Impossible d'obtenir la localisation.")
    } finally {
      setIsLoadingLocation(false)
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized) {
      getCurrentLocation()
      setHasInitialized(true)
    }
  }, [getCurrentLocation, hasInitialized])

  useEffect(() => {
    setRegion({
      latitude: coordinates[0] || STRASBOURG_COORDINATES.latitude,
      longitude: coordinates[1] || STRASBOURG_COORDINATES.longitude,
      latitudeDelta: USER_DELTA.latitudeDelta,
      longitudeDelta: USER_DELTA.longitudeDelta,
    })
  }, [coordinates])

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    const coords: Coordinates = [latitude, longitude]
    onCoordinatesChangeRef.current(coords)
  }

  return {
    isLoadingLocation,
    region,
    mapRef,
    getCurrentLocation,
    handleMapPress,
  }
}
