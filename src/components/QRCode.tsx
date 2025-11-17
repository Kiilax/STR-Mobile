import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, TouchableOpacity } from "react-native"
import QRCodeScanner from "./QRCodeScanner"
import { useState } from "react"
import ModalWrapper from "./ui/modal"

export default function QRCode() {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedIP, setScannedIP] = useState<string | null>(null)

  const handleQRScanResult = (ip: string) => {
    setScannedIP(ip)
    setShowQRScanner(false)
    console.log("Scanned IP:", scannedIP)
  }

  return (
    <>
      <TouchableOpacity style={styles.qrCodeContainer} onPress={() => setShowQRScanner(true)}>
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
      </TouchableOpacity>
      <ModalWrapper
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        fullScreen={true}
      >
        <QRCodeScanner onScanResult={handleQRScanResult} onClose={() => setShowQRScanner(false)} />
      </ModalWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 140,
    right: 20,
    width: 55,
    height: 55,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
})
