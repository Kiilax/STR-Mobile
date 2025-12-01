import { CameraView } from "expo-camera"
import { StatusBar } from "expo-status-bar"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useQRScanner } from "@/modules/synchronization/hooks/useQRScanner"
import { colors } from "@/constants/theme"
import { styles } from "./qr-code-scanner.styles"
import { useRouter } from "expo-router"
import useQRCodeStore from "@/hooks/useQRCodeStore"


export default function QRCodeScanner() {
  const router = useRouter()
  const onClose = () => {
    router.back()
  }
  const { isGranted, loading, error } = useQRScanner()

  const handleScanResult = ({ data }: { data: string }) => {
    useQRCodeStore.getState().setResult(data)
    router.back()
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Ionicons name="hourglass" size={48} color={colors.dark.inverted} />
      </View>
    )
  }

  if (!isGranted) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.dark.inverted} />
          </Pressable>
          <Text style={styles.mainText}>QR Code Scanner</Text>
        </View>
        {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.dark.inverted} />
        </Pressable>
        <Text style={styles.mainText}>Scan QR Code</Text>
      </View>

      <View style={styles.camStyle}>
        <CameraView
          style={styles.cameraSquare}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleScanResult}
        />
      </View>
    </View>
  )
}
