import { View, Text, TouchableOpacity } from "react-native"
import MapView from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "./hooks/useMap"
import { styles } from "./map.styles"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]
export default function MapScreen() {
  const { mapRef, region, isFollowing, errorMsg, handleMapDrag, handleCenterOnUser } = useMap()
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        region={region}
        onPanDrag={handleMapDrag}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation={isFollowing}
        rotateEnabled
      />
      <TouchableOpacity style={styles.fab} onPress={handleCenterOnUser}>
        <Ionicons name="locate" size={26} color="white" />
      </TouchableOpacity>
    </View>
  )
}
