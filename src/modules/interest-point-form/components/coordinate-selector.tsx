import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";
import { STRASBOURG_COORDINATES } from "@/constants/coordinates";
import { useCoordinateSelector } from "@/modules/interest-point-form/hooks/useCoordinateSelector";
import { Coordinates } from "@/types";
import { Button } from "@/components";

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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Coordonnées</Text>
        <Button
          title={isLoadingLocation ? "Localisation..." : "Ma position"}
          icon={<Ionicons name="location" size={16} color="white" />}
          size="sm"
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
          loading={isLoadingLocation}
          variant="outline"
        />
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
  card: {
    backgroundColor: colors.dark.secondary || "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.h4.fontSize,
    fontWeight: "600",
  },
  mapContainer: {
    position: "relative",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#000",
  },
  map: {
    flex: 1,
  },
  helpText: {
    fontSize: 12,
    color: colors.dark.inverted,
    opacity: 0.6,
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  errorText: {
    color: "#F44336",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
});
