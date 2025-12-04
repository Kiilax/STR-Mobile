import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "@/modules/map/hooks"
import { colors, darkTheme } from "@/constants/theme"
import MapView, { Marker, Polygon, Polyline, PROVIDER_DEFAULT } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { useMarkers } from "@/modules/map/hooks/useMarkers"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

export default function MapScreen() {
  const {
    geometries,
    route,
    mapRef,
    region,
    isFollowing,
    userLocation,
    handleMapDrag,
    handleCenterOnUser,
  } = useMap()
  const { interestPointMarkers, routeMarkers, routeOrigin, nextMarker, distanceNextMarker } =
    useMarkers({ userLocation })

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
                coordinate={{
                  ...marker.coordinates,
                }}
                title={marker.quantity?.toString() || ""}
                image={
                  marker.isVisited
                    ? require("@/assets/markers/md-gr.png")
                    : require("@/assets/markers/item-sm.png")
                }
              />
            ) : null
          )}
        {routeMarkers.length > 0 && routeOrigin?.coords && (
          <MapViewDirections
            origin={{
              ...routeOrigin.coords,
            }}
            destination={{
              ...routeMarkers[routeMarkers.length - 1].coordinates,
            }}
            splitWaypoints={true}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor="red"
            mode="DRIVING"
            onError={(e) => console.log("MapDirections error :", e)}
          />
        )}
        {route &&
          route.length > 0 &&
          route.map((segment, index) => (
            <Polyline key={index} coordinates={segment} strokeColor="red" strokeWidth={4} />
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
          {distanceNextMarker !== null ? nextMarker?.updatedAt : "Aucun point d'intérêt à visiter"}
        </Text>
        <Text style={styles.distanceText}>
          {distanceNextMarker !== null ? `${distanceNextMarker}m` : ""}
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
    </View>
  )
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
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  addressText: {
    color: colors.dark.tint,
    padding: 15,
    flex: 1,
    width: "70%",
  },
  distanceText: {
    color: "cyan",
    padding: 15,
    textAlign: "right",
    width: "30%",
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
})
