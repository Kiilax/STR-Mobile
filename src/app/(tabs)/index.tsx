import { View, Text, StyleSheet, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMap } from "@/modules/map/hooks";
import { colors, darkTheme, typography } from "@/constants/theme";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useEffect, useState, useCallback, Fragment } from "react";
import { ModalWrapper, ErrorModal, Button } from "@/components";
import EquipmentActions from "@/components/equipment-actions/equipment-actions";
import {
  useEquipmentsStore,
  useEventDataStore,
  useInterestPointsStore,
  useAlertModal,
} from "@/hooks";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

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
  const { alertState, showError, hideAlert } = useAlertModal();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const {
    zones,
    course,
    mapRef,
    region,
    isFollowing,
    userLocation,
    handleMapDrag,
    handleCenterOnUser,
    handleZoomToEvent,
  } = useMap();

  const { getEquipmentById } = useEquipmentsStore();
  const { interestPoints } = useInterestPointsStore();
  const { equipmentPlacements, getEquipmentPlacementById } =
    useEquipmentPlacementStore();

  const [equipmentPlacementId, setEquipmentPlacementId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (params.zoomToEvent === "true" && eventData && mapRef.current) {
      setTimeout(() => {
        handleZoomToEvent();
      }, 500);
    }
  }, [params.zoomToEvent, eventData, handleZoomToEvent, mapRef]);

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

              return (
                <Fragment key={marker.id}>
                  <Marker
                    coordinate={marker.coordinates[0]}
                    image={
                      equipment?.image ||
                      require("@/assets/markers/item-md.png")
                    }
                    onPress={() => {
                      setShowModal(true);
                      setEquipmentPlacementId(marker.id);
                    }}
                  />
                  {marker.coordinates.length > 1 && isVehicle && (
                    <Polygon
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
                  )}
                  {marker.coordinates.length > 1 && !isVehicle && (
                    <Polyline
                      coordinates={marker.coordinates}
                      strokeColor={strokeColor}
                      strokeWidth={2}
                      tappable
                      onPress={() => {
                        setShowModal(true);
                        setEquipmentPlacementId(marker.id);
                      }}
                    />
                  )}
                </Fragment>
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
          Astuce : cliquer sur un équipement de sécurité pour afficher ses
          actions
        </Text>
      </View>

      {!isFollowing && (
        <Button
          icon={<Ionicons name="locate" size={26} color="white" />}
          iconOnly
          size="lg"
          onPress={handleCenterOnUser}
          style={styles.fab}
        />
      )}

      {isFollowing && !userLocation && (
        <Button
          iconOnly
          size="lg"
          loading
          onPress={handleCenterOnUser}
          style={styles.fab}
        />
      )}

      <ModalWrapper
        visible={
          showModal &&
          equipmentPlacementId !== null &&
          !!getEquipmentPlacementById(equipmentPlacementId)
        }
        onClose={() => setShowModal(false)}
        overlayOpacity={0}
      >
        <EquipmentActions
          placementId={equipmentPlacementId!}
          onClose={() => setShowModal(false)}
          onError={showError}
        />
      </ModalWrapper>

      <ErrorModal
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
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
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  tourFab: {
    bottom: 160,
    backgroundColor: colors.dark.tint,
  },
  paragraph: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    textAlign: "center",
  },
  addressText: {
    color: colors.dark.tint,
    padding: 15,
    flex: 1,
    width: "100%",
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
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
