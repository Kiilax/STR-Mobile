import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "@/src/hooks"
import { styles } from "@/src/app/map/map.styles"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { InterestPoint } from "@/src/types"
import { useEffect, useState } from "react"
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
  const { interestPoints: markers } = useMainContext()

  useEffect(() => {
    const sortMarkersByDistance = () => {
      if (!userLocation) {
        setSortedMarkers(markers)
        return
      }

      const sorted = [...markers].sort((a, b) => {
        const distanceA = geolib.getDistance(
          { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
          { latitude: a.latitude, longitude: a.longitude }
        )
        const distanceB = geolib.getDistance(
          { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
          { latitude: b.latitude, longitude: b.longitude }
        )
        return distanceA - distanceB
      })
      setSortedMarkers(sorted)
    }
    sortMarkersByDistance()
  }, [markers, userLocation])

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
            image={require("./favicon.png")}
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
            strokeColor="red"
            mode="DRIVING"
            onError={(e) => console.log("MapDirections error :", e)}
          />
        )}
      </MapView>

      <Text style={styles.addressText}>{"Sélectionnez un point d'intérêt"}</Text>

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
