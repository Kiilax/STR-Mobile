import { View, Text, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMap } from "./hooks/useMap"
import { styles } from "./map.styles"
import { QRCodeScanner } from "@/src/components"
import { useState } from "react"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import MapView from "react-native-maps"
import { colors } from "@/src/constants/theme"
const mapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
]

export default function MapScreen() {
  const { mapRef, region, isFollowing, errorMsg, handleMapDrag, handleCenterOnUser } = useMap()
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
        userInterfaceStyle="dark"
        tintColor={colors.dark.tint}
      />

      <TouchableOpacity style={styles.fab} onPress={handleCenterOnUser}>
        <Ionicons name="locate" size={26} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.qrCodeContainer} onPress={handleQRCodePress}>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
      </TouchableOpacity>

      <Modal visible={showQRScanner} animationType="fade">
        <QRCodeScanner onScanResult={handleQRScanResult} onClose={handleCloseQRScanner} />
      </Modal>
    </View>
  )
}
