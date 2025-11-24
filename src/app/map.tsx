import { View, TouchableOpacity, ActivityIndicator, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "@/modules/map/hooks"
import { colors, darkTheme } from "@/constants/theme"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { InterestPoint } from "@/types"
import { useEffect, useState, useCallback } from "react"
import * as geolib from "geolib"
import { useMainContext } from "@/context/mainContext"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

export default function MapScreen() {
  const { mapRef, region, isFollowing, userLocation, handleMapDrag, handleCenterOnUser } = useMap()
  const [sortedMarkers, setSortedMarkers] = useState<InterestPoint[]>([])
  const { interestPoints: markers, refreshInterestPoints } = useMainContext()
  const [distanceNextMarker, setDistanceNextMarker] = useState<number | null>(null)
  const [nextMarker, setNextMarker] = useState<InterestPoint | null>(null)

  const calculateDistance = useCallback(
    (point: InterestPoint) => {
      if (!userLocation) return null
      return geolib.getDistance(
        { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
        { latitude: point.latitude, longitude: point.longitude }
      )
    },
    [userLocation]
  )

  useEffect(() => {
    const sortMarkersByDistance = () => {
      if (!userLocation) {
        setSortedMarkers(markers)
        return
      }

      const sorted = [...markers].sort((a, b) => {
        const distanceA = calculateDistance(a) || Infinity
        const distanceB = calculateDistance(b) || Infinity
        return distanceA - distanceB
      })
      setSortedMarkers(sorted)
    }
    sortMarkersByDistance()
  }, [markers, userLocation, calculateDistance])

  useEffect(() => {
    refreshInterestPoints()
  }, [refreshInterestPoints])

  useEffect(() => {
    if (sortedMarkers.length > 0) {
      let foundNext = false
      for (const marker of sortedMarkers) {
        if (marker.isVisited === false) {
          const dist = calculateDistance(marker)
          setDistanceNextMarker(dist)
          setNextMarker(marker)
          foundNext = true
          break
        }
      }

      if (!foundNext) {
        setDistanceNextMarker(null)
        setNextMarker(null)
      }
    } else {
      setDistanceNextMarker(null)
      setNextMarker(null)
    }
  }, [sortedMarkers, userLocation, calculateDistance])

  useEffect(() => {
    if (distanceNextMarker !== null && nextMarker) {
      if (distanceNextMarker <= 50) {
        nextMarker.isVisited = true
      }
    }
  }, [userLocation, distanceNextMarker, nextMarker, refreshInterestPoints])

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
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
        {sortedMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.comment}
            image={
              marker.isVisited
                ? require("@/assets/markers/md-gr.png")
                : require("@/assets/markers/md-red.png")
            }
          />
        ))}
        {sortedMarkers.length > 0 && userLocation && (
          <MapViewDirections
            origin={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            waypoints={sortedMarkers}
            destination={{
              latitude: sortedMarkers[sortedMarkers.length - 1].latitude,
              longitude: sortedMarkers[sortedMarkers.length - 1].longitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor="#00D4FF"
            mode="DRIVING"
            onError={(e) => console.log("MapDirections error :", e)}
          />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.addressText}>
          {distanceNextMarker !== null ? nextMarker?.address : "Aucun point d'intérêt à visiter"}
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
    left: 0,
    borderTopRightRadius: 10,
    maxWidth: "80%",
    backgroundColor: darkTheme.colors.card,
    flexDirection: "row",
    alignItems: "center",
  },
})
