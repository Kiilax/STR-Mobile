import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "@/src/hooks"
import { styles } from "@/src/app/map/map.styles"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { InterestPoint } from "@/src/types"
import { useEffect, useState, useCallback } from "react"
import * as geolib from "geolib" // import { colors } from "@/src/constants/theme"
import { useMainContext } from "@/src/context/mainContext"

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
    console.log("User location updated:", userLocation)
    if (distanceNextMarker !== null && nextMarker) {
      console.log(`Distance to next marker (${nextMarker.comment}):`, distanceNextMarker)
      if (distanceNextMarker <= 50) {
        console.log(`Arrived at marker: ${nextMarker.comment}`)
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
                ? require("@/src/assets/markers/md-gr.png")
                : require("@/src/assets/markers/md-red.png")
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
            strokeColor="blue"
            mode="DRIVING"
            onError={(e) => console.log("MapDirections error :", e)}
          />
        )}
      </MapView>

      <Text style={styles.distanceText}>
        {distanceNextMarker !== null
          ? `Distance jusqu'à ${nextMarker?.comment} : ${distanceNextMarker}m`
          : "Sélectionnez un point d'intérêt"}
      </Text>

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
