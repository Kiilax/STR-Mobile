import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet } from "react-native"
import QRCodeScanner from "./QRCodeScanner"
import { useState } from "react"
import ModalWrapper from "../ui/modal"
import { useFloatingButtonsPosition } from "@/src/hooks"
import { useMainContext } from "@/src/context/mainContext"

export default function QRCode() {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const { buttonBottom } = useFloatingButtonsPosition()
  const { setIp } = useMainContext()
  const handleQRScanResult = (ip: string) => {
    if (!ip || ip.trim() === "") return
    setIp(ip)
    setShowQRScanner(false)
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.qrCodeContainer, { bottom: buttonBottom }]}
        onPress={() => setShowQRScanner(true)}
      >
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
    position: "absolute",
    backgroundColor: "#fff",
    right: 20,
    width: 55,
    height: 55,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
})
