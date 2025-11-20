import { View, TouchableOpacity, ActivityIndicator, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap, useRouteZoom } from "@/src/hooks"
import { styles } from "@/src/app/map/map.styles"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import INTEREST_POINTS_MOCK from "@/src/data/interest-points.mock"
import { InterestPoint } from "@/src/types"
import { useState } from "react"
import { colors } from "@/src/constants/theme"
import Geocoder from "react-native-geocoding"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

export default function MapScreen() {
  const { mapRef, region, isFollowing, userLocation, handleMapDrag, handleCenterOnUser } = useMap()
  const [selectedPoint, setSelectedPoint] = useState<InterestPoint | null>(null)

  const markers = INTEREST_POINTS_MOCK as InterestPoint[]

  useRouteZoom({ mapRef, selectedPoint, userLocation })

  const handleMarkerPress = (marker: InterestPoint) => {
    setSelectedPoint(marker)
  }

  const getAdressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const res = await Geocoder.geocodePosition({ lat: latitude, lng: longitude })
      if (res && res.length > 0) {
        return res[0].formattedAddress
      }
    } catch (error) {
      console.error("Error getting address from coordinates:", error)
    }
  }

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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.coordinates[0],
              longitude: marker.coordinates[1],
            }}
            title={marker.comment}
            image={require("./favicon.png")}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        {selectedPoint && userLocation && (
          <MapViewDirections
            origin={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            destination={{
              latitude: selectedPoint.coordinates[0],
              longitude: selectedPoint.coordinates[1],
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
            strokeWidth={4}
            strokeColor={colors.dark.tint}
            mode="DRIVING"
            onError={(e) => console.log("MapDirections error :", e)}
          />
        )}
      </MapView>

      <Text
        style={{
          position: "absolute",
          top: 40,
          backgroundColor: "white",
          color: colors.dark.tint,
        }}
      >
        A
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
