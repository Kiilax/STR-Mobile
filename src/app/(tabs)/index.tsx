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

export default function MapScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] =
    useState<EquipmentPlacement | null>(null);
  const {
    geometries,
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
    const unvisited = routeMarkers.filter((m) => !m.isVisited);

    if (unvisited.length === 0) {
      Alert.alert(
        "Tout est visité",
        "Vous avez déjà visité tous les points de cet itinéraire !"
      );
      return;
    }

    const destination = unvisited[unvisited.length - 1];
    const waypoints = unvisited.slice(0, unvisited.length - 1);
    const destCoords = `${destination.coordinates.latitude},${destination.coordinates.longitude}`;

    let url = `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=driving`;

    if (waypoints.length > 0) {
      const waypointsStr = waypoints
        .map((p) => `${p.coordinates.latitude},${p.coordinates.longitude}`)
        .join("|");
      url += `&waypoints=${waypointsStr}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const first = unvisited[0];
        const appleUrl = `http://maps.apple.com/?daddr=${first.coordinates.latitude},${first.coordinates.longitude}&dirflg=d`;
        await Linking.openURL(appleUrl);
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
        {interestPointMarkers?.map((marker) =>
          marker?.coordinates ? (
            <Marker
              key={marker.id}
              coordinate={{
                ...marker.coordinates,
              }}
            />
          ) : null
        )}
        {routeMarkers &&
          routeMarkers.length > 0 &&
          routeMarkers.map((marker) =>
            marker?.coordinates ? (
              <Marker
                key={marker.id}
                onPress={() => {
                  setSelectedPlacement(marker);
                  setShowModal(true);
                }}
                coordinate={{
                  ...marker.coordinates,
                }}
                image={
                  marker.isVisited
                    ? require("@/assets/markers/md-gr.png")
                    : getEquipmentById(marker.equipmentId)?.image
                }
              />
            ) : null
          )}
        {course &&
          course.length > 0 &&
          course.map((segment, index) => (
            <Polyline
              key={index}
              coordinates={segment.route}
              strokeColor="red"
              strokeWidth={4}
            />
          ))}
        {geometries &&
          geometries.length > 0 &&
          geometries.map((segment, index) => (
            <Polygon
              key={index}
              coordinates={segment}
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

      <ModalWrapper visible={showModal} onClose={() => setShowModal(false)}>
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
