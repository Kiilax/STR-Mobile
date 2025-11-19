import { CameraView } from "expo-camera"
import { StatusBar } from "expo-status-bar"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useQRScanner } from "@/src/hooks/useQRScanner"
import { colors } from "@/src/constants/theme"
import ModalWrapper from "./ui/modal"
import { useState } from "react"
import QRCodeDataDisplay from "../app/synchronization"

interface QRCodeScannerProps {
  onScanResult: (ip: string) => void
  onClose: () => void
}

export default function QRCodeScanner({ onScanResult, onClose }: QRCodeScannerProps) {
  const { isGranted, loading, error } = useQRScanner()
  const [showModal, setShowModal] = useState(false)

  const handleScanResult = ({ data }: { data: string }) => {
    setShowModal(true)
    console.log("Visible Modal:", showModal)
    onScanResult(data)
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
      <ModalWrapper visible={showModal} onClose={() => setShowModal(false)}>
        <QRCodeDataDisplay />
      </ModalWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    color: colors.dark.text,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.inverted,
    width: "100%",
  },

  btnCancel: {
    backgroundColor: "#ff4444",
  },

  mainText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: colors.dark.inverted,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    color: colors.dark.inverted,
    marginTop: 20,
    marginBottom: 20,
  },
  camStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  cameraSquare: {
    width: Platform.OS === "web" ? 400 : 300,
    height: Platform.OS === "web" ? 400 : 300,
  },
})
