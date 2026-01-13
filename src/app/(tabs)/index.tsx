import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
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
import { useEffect, useState } from "react";
import { ModalWrapper } from "@/components";
import EquipmentActions from "@/components/equipment-actions/equipment-actions";
import {
  useEquipmentsStore,
  useEventDataStore,
  useInterestPointsStore,
} from "@/hooks";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { useLocalSearchParams } from "expo-router";

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export default function MapScreen() {
  const params = useLocalSearchParams();
  const { eventData } = useEventDataStore();
  const [showModal, setShowModal] = useState(false);

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

  const { getEquipmentById } = useEquipmentsStore();
  const { interestPoints } = useInterestPointsStore();
  const { equipmentPlacements, getEquipmentPlacementById } =
    useEquipmentPlacementStore();

  const [equipmentPlacementId, setEquipmentPlacementId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (
      params.focusPlacementId &&
      params.latitude &&
      params.longitude &&
      mapRef.current
    ) {
      const latitude = parseFloat(params.latitude as string);
      const longitude = parseFloat(params.longitude as string);
      const placementId = parseInt(params.focusPlacementId as string, 10);

      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );

      const placement = getEquipmentPlacementById(placementId);

      if (placement) {
        setEquipmentPlacementId(placement.id);
        setShowModal(true);
      }
    }
  }, [
    params.focusPlacementId,
    params.latitude,
    params.longitude,
    mapRef,
    eventData,
    getEquipmentPlacementById,
  ]);

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
        {interestPoints
          ?.filter((marker) => marker?.coordinates)
          .map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              image={require("@/assets/markers/md-red.png")}
            />
          ))}

        {equipmentPlacements &&
          equipmentPlacements
            .filter(
              (marker) => marker.coordinates && marker.coordinates.length > 0
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
                      setShowModal(true);
                      setEquipmentPlacementId(marker.id);
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
                      setShowModal(true);
                      setEquipmentPlacementId(marker.id);
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
                    setShowModal(true);
                    setEquipmentPlacementId(marker.id);
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

      <ModalWrapper
        visible={showModal}
        onClose={() => setShowModal(false)}
        overlayOpacity={0}
      >
        <EquipmentActions
          placementId={equipmentPlacementId!}
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
