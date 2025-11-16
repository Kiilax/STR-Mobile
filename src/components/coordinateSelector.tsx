import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { colors } from "../constants/theme"
import { Coordinates } from "../types"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

interface CoordinateSelectorProps {
  coordinates: Coordinates
  onCoordinatesChange: (coords: Coordinates) => void
  error?: string
}

export default function CoordinateSelector({
  coordinates,
  onCoordinatesChange,
  error,
}: CoordinateSelectorProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [region, setRegion] = useState({
    latitude: coordinates[0] || 48.5734053,
    longitude: coordinates[1] || 7.7521113,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (coordinates[0] !== 0 && coordinates[1] !== 0) {
      setRegion({
        latitude: coordinates[0],
        longitude: coordinates[1],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }, [coordinates])

  const getCurrentLocation = async () => {
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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }

      setRegion(newRegion)
      onCoordinatesChange(coords)

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000)
      }
    } catch {
      Alert.alert("Erreur", "Impossible d'obtenir la localisation.")
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    const coords: Coordinates = [latitude, longitude]
    onCoordinatesChange(coords)
  }

  const hasValidCoordinates = coordinates[0] !== 0 && coordinates[1] !== 0

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Coordonnées</Text>
        <TouchableOpacity
          style={[styles.locationButton, isLoadingLocation && styles.locationButtonDisabled]}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="location" size={16} color="white" />
          )}
          <Text style={styles.locationButtonText}>
            {isLoadingLocation ? "Localisation..." : "Ma position"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={mapStyle}
          region={region}
          onPress={handleMapPress}
          showsMyLocationButton={false}
          rotateEnabled={false}
          pitchEnabled={false}
          mapType="standard"
          userInterfaceStyle="dark"
        >
          {hasValidCoordinates && (
            <Marker
              coordinate={{
                latitude: coordinates[0],
                longitude: coordinates[1],
              }}
              title="Point d'intérêt"
              description="Emplacement sélectionné"
            />
          )}
        </MapView>
      </View>

      <Text style={styles.helpText}>
        Appuyez sur la carte pour placer le marqueur ou utilisez &quot;Ma position&quot;
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.text,
  },
  locationButton: {
    backgroundColor: colors.dark.tint,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  mapContainer: {
    position: "relative",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.dark.accent,
  },
  map: {
    flex: 1,
  },
  coordsText: {
    fontSize: 12,
    color: colors.dark.accent,
    marginTop: 8,
    textAlign: "center",
  },
  helpText: {
    fontSize: 11,
    color: colors.dark.accent,
    marginTop: 4,
    textAlign: "center",
    fontStyle: "italic",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
})
