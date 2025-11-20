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
  const handleQRScanResult = async (data: string) => {
    if (!data || data.trim() === "") return
    const ips = data.split(";")
    console.log("Scanned IPs:", ips)
    let neo: string | null = null
    for (const ip of ips) {
      try {
        const response = await fetch(`http://${ip}`, {
          method: "GET",
        })

        if (response.ok) {
          neo = `http://${ip}`
          setIp(neo)
          setShowQRScanner(false)
          break
        }
      } catch (err) {
        console.log("Fetch error with", ip, err)
      }
    }
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
