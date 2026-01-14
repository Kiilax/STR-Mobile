import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { colors } from "@/constants/theme";
import { STRASBOURG_COORDINATES } from "@/constants/coordinates";
import { useCoordinateSelector } from "@/modules/interest-point-form/hooks/useCoordinateSelector";
import { Coordinates } from "@/types";

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

interface CoordinateSelectorProps {
  coordinates: Coordinates;
  onCoordinatesChange: (coords: Coordinates) => void;
  error?: string;
  onError?: (title: string, message: string) => void;
}

export default function CoordinateSelector({
  coordinates,
  onCoordinatesChange,
  error,
  onError,
}: CoordinateSelectorProps) {
  const {
    isLoadingLocation,
    region,
    mapRef,
    getCurrentLocation,
    handleMapPress,
  } = useCoordinateSelector({
    coordinates,
    onCoordinatesChange,
    onError,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Coordonnées</Text>
        <TouchableOpacity
          style={[
            styles.locationButton,
            isLoadingLocation && styles.locationButtonDisabled,
          ]}
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
          <Marker
            coordinate={{
              latitude: coordinates.latitude || STRASBOURG_COORDINATES.latitude,
              longitude:
                coordinates.longitude || STRASBOURG_COORDINATES.longitude,
            }}
            title="Point à sécuriser"
            description="Emplacement sélectionné"
          />
        </MapView>
      </View>

      <Text style={styles.helpText}>
        Appuyez sur la carte pour placer le marqueur ou utilisez &quot;Ma
        position&quot;
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
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
});
