import { QRCodeScanner } from "@/modules/synchronization/components"
import { View } from "react-native"
import { useRouter } from "expo-router"
import { useRef } from "react"
import { useMainContext } from "@/context/mainContext"

export default function EventScanner() {
  const router = useRouter()
  const hasNavigated = useRef(false)
  const { setEventId } = useMainContext()

  const handleScanResult = (data: string) => {
    if (hasNavigated.current) return

    console.log("Scanned QR Code data:", data)
    hasNavigated.current = true
    const eventIdNumber = parseInt(data, 10)
    if (!isNaN(eventIdNumber)) {
      setEventId(eventIdNumber)
      router.push("/(tabs)")
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner title="Synchroniser un événement" onScanResult={handleScanResult} />
    </View>
  )
}
