import { View, TouchableOpacity, Modal, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "@/src/hooks"
import { styles } from "@/src/app/map/map.styles"
import { QRCodeScanner } from "@/src/components"
import { useState } from "react"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import MapView from "react-native-maps"

const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

export default function MapScreen() {
  const { mapRef, region, isFollowing, userLocation, handleMapDrag, handleCenterOnUser } = useMap()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedIP, setScannedIP] = useState<string | null>(null)

  const handleQRCodePress = () => {
    setShowQRScanner(true)
  }

  const handleQRScanResult = (ip: string) => {
    setScannedIP(ip)
    setShowQRScanner(false)
    console.log("Scanned IP:", scannedIP)
  }

  const handleCloseQRScanner = () => {
    setShowQRScanner(false)
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
        rotateEnabled
        mapType="standard"
        userInterfaceStyle="dark"
      />
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

      <TouchableOpacity style={styles.qrCodeContainer} onPress={handleQRCodePress}>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
      </TouchableOpacity>

      <Modal visible={showQRScanner} animationType="fade">
        <QRCodeScanner onScanResult={handleQRScanResult} onClose={handleCloseQRScanner} />
      </Modal>
    </View>
  )
}
