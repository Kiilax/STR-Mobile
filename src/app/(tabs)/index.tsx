import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMap } from "@/modules/map/hooks";
import { colors, darkTheme } from "@/constants/theme";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useMarkers } from "@/modules/map/hooks/useMarkers";
import { useState } from "react";
import { ModalWrapper } from "@/components";
import EquipmentActions from "@/components/equipment-actions/equipment-actions";
import { EquipmentPlacement } from "@/types";
import { useEquipmentsStore } from "@/hooks";

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const isValidCoordinate = (coord: any): boolean => {
  return (
    coord &&
    typeof coord === "object" &&
    typeof coord.latitude === "number" &&
    !isNaN(coord.latitude) &&
    typeof coord.longitude === "number" &&
    !isNaN(coord.longitude)
  );
};

export default function MapScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] =
    useState<EquipmentPlacement | null>(null);
  const {
    zones,
    course,
    mapRef,
    region,
    isFollowing,
    userLocation,
    handleMapDrag,
    handleCenterOnUser,
  } = useMap();
  const { interestPointMarkers, routeMarkers } = useMarkers({
    userLocation,
  });

  const { equipments } = useEquipmentsStore();

  const getEquipmentById = (id: number) => {
    return equipments.find((eq) => eq.id === id);
  };

  const handleStartTour = async () => {
    const unvisited = routeMarkers.filter(
      (m) =>
        !m.isVisited &&
        m.coordinates &&
        m.coordinates.length > 0 &&
        m.coordinates[0] &&
        isValidCoordinate(m.coordinates[0])
    );

    if (unvisited.length === 0) {
      Alert.alert(
        "Tout est visité",
        "Vous avez déjà visité tous les points de cet itinéraire !"
      );
      return;
    }

    const destination = unvisited[unvisited.length - 1];
    if (
      !destination.coordinates ||
      destination.coordinates.length === 0 ||
      !isValidCoordinate(destination.coordinates[0])
    ) {
      Alert.alert("Erreur", "Coordonnées de destination non disponibles.");
      return;
    }

    const waypoints = unvisited.slice(0, unvisited.length - 1);
    const destCoords = `${destination.coordinates[0].latitude},${destination.coordinates[0].longitude}`;

    let url = `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=driving`;

    if (waypoints.length > 0) {
      const validWaypoints = waypoints.filter(
        (p) =>
          p.coordinates &&
          p.coordinates.length > 0 &&
          isValidCoordinate(p.coordinates[0])
      );

      if (validWaypoints.length > 0) {
        const waypointsStr = validWaypoints
          .map(
            (p) => `${p.coordinates[0].latitude},${p.coordinates[0].longitude}`
          )
          .join("|");
        url += `&waypoints=${waypointsStr}`;
      }
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Erreur",
          "Impossible d'ouvrir l'application de navigation."
        );
        return;
      }
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ouvrir l'application de navigation.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        region={region}
        onPanDrag={handleMapDrag}
        showsUserLocation
        showsMyLocationButton={false}
        rotateEnabled
        mapType="standard"
        userInterfaceStyle="dark"
        toolbarEnabled={false}
      >
        {interestPointMarkers
          ?.filter(
            (marker) =>
              marker?.coordinates && isValidCoordinate(marker.coordinates)
          )
          .map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              image={require("@/assets/markers/md-red.png")}
            />
          ))}

        {routeMarkers &&
          routeMarkers
            .filter(
              (marker) =>
                marker.coordinates &&
                marker.coordinates.length > 0 &&
                isValidCoordinate(marker.coordinates[0])
            )
            .map((marker) => {
              const equipment = getEquipmentById(marker.equipmentId);
              const isVehicle = equipment?.type === "vehicle";
              const strokeColor = marker.isVisited ? "green" : "red";
              const fillColor = marker.isVisited
                ? "rgba(0,255,0,0.3)"
                : "rgba(255,0,0,0.3)";
              if (marker.coordinates.length === 1) {
                return (
                  <Marker
                    key={marker.id}
                    coordinate={marker.coordinates[0]}
                    image={
                      marker.isVisited
                        ? require("@/assets/markers/md-gr.png")
                        : equipment?.image
                    }
                    onPress={() => {
                      setSelectedPlacement(marker);
                      setShowModal(true);
                    }}
                  />
                );
              }
              if (isVehicle) {
                return (
                  <Polygon
                    key={marker.id}
                    coordinates={marker.coordinates}
                    strokeColor={strokeColor}
                    fillColor={fillColor}
                    strokeWidth={2}
                    tappable
                    onPress={() => {
                      setSelectedPlacement(marker);
                      setShowModal(true);
                    }}
                  />
                );
              }

              return (
                <Polyline
                  key={marker.id}
                  coordinates={marker.coordinates}
                  strokeColor={strokeColor}
                  strokeWidth={2}
                  tappable
                  onPress={() => {
                    setSelectedPlacement(marker);
                    setShowModal(true);
                  }}
                />
              );
            })}

        {course &&
          course.length > 0 &&
          course.map((lines) => (
            <Polyline
              key={lines.id}
              coordinates={lines.route}
              strokeColor={
                lines.color ? `${lines.color}90` : "rgba(0,0,255,0.3)"
              }
              strokeWidth={8}
            />
          ))}

        {zones &&
          zones.length > 0 &&
          zones.map((zone, index) => (
            <Polygon
              key={index}
              coordinates={zone.coordinates}
              strokeColor="green"
              fillColor="rgba(0,255,0,0.3)"
              strokeWidth={2}
            />
          ))}
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.addressText}>
          Astuce : cliquer sur un point pour démarrer le GPS ou le marquer comme
          visité
        </Text>
      </View>

      {!isFollowing && (
        <TouchableOpacity style={styles.fab} onPress={handleCenterOnUser}>
          <Ionicons name="locate" size={26} color="white" />
        </TouchableOpacity>
      )}

      {isFollowing && !userLocation && (
        <TouchableOpacity style={styles.fab} onPress={handleCenterOnUser}>
          <ActivityIndicator size="small" color="white" />
        </TouchableOpacity>
      )}

      {routeMarkers.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, styles.tourFab]}
          onPress={handleStartTour}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={26} color="white" />
        </TouchableOpacity>
      )}

      <ModalWrapper
        visible={showModal}
        onClose={() => setShowModal(false)}
        overlayOpacity={0}
      >
        <EquipmentActions
          placement={selectedPlacement}
          onClose={() => setShowModal(false)}
        />
      </ModalWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 95,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  tourFab: {
    bottom: 160,
    backgroundColor: colors.dark.tint,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  addressText: {
    color: colors.dark.tint,
    padding: 15,
    flex: 1,
    width: "100%",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 10,
    maxWidth: "80%",
    backgroundColor: darkTheme.colors.card,
    flexDirection: "row",
    alignItems: "center",
  },
});
