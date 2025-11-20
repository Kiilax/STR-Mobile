import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, StyleSheet, View, Text } from "react-native"
import QRCodeScanner from "./QRCodeScanner"
import { useState } from "react"
import ModalWrapper from "../ui/modal"
import { useMainContext } from "@/src/context/mainContext"

export default function QRCode() {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const { ip, setIp } = useMainContext()
  const [isFetching, setIsFetching] = useState(false)
  const fetchWithTimeout = (url: string, options: any = {}, timeout = 800) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout)),
    ])
  }

  const handleQRScanResult = async (data: string) => {
    if (!data || data.trim() === "") return
    const ips = data.split(";")
    let neo: string | null = null
    for (const ip of ips) {
      if (isFetching) break
      try {
        setIsFetching(true)
        const response = (await fetchWithTimeout(
          `http://${ip}`,
          {
            method: "GET",
          },
          400
        )) as Response
        if (response.ok) {
          neo = `http://${ip}`
          setIp(neo)
          setShowQRScanner(false)
          break
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      } catch (err) {
      } finally {
        setIsFetching(false)
      }
    }
  }

  const handleCloseScanner = () => {
    setShowQRScanner(false)
  }

  const handleScanAgain = () => {
    setIp("") // Reset the IP to allow scanning again
  }

  return (
    <View style={styles.container}>
      {/* Bouton principal Scan QR Code */}
      {!ip ? (
        <TouchableOpacity style={styles.scanButton} onPress={() => setShowQRScanner(true)}>
          <View style={styles.scanButtonContent}>
            <MaterialCommunityIcons name="qrcode-scan" size={28} color="#007AFF" />
            <View style={styles.scanButtonText}>
              <Text style={styles.scanButtonTitle}>Scanner le QR Code</Text>
              <Text style={styles.scanButtonSubtitle}>Cliquez pour scanner le code du site</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      ) : (
        // Affichage après scan réussi
        <View style={styles.scanResult}>
          <View style={styles.scanSuccessHeader}>
            <View style={styles.scanSuccessIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.scanSuccessText}>
              <Text style={styles.scanSuccessTitle}>QR Code scanné avec succès</Text>
              <Text style={styles.scanSuccessSubtitle}>Site connecté</Text>
            </View>
          </View>

          <View style={styles.ipContainer}>
            <Text style={styles.ipLabel}>Adresse du site:</Text>
            <View style={styles.ipValueContainer}>
              <Text style={styles.ipValue} numberOfLines={1} ellipsizeMode="middle">
                {ip}
              </Text>
              <TouchableOpacity style={styles.rescanButton} onPress={handleScanAgain}>
                <Ionicons name="refresh" size={16} color="#007AFF" />
                <Text style={styles.rescanText}>Changer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal du scanner QR Code */}
      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner} fullScreen>
        <QRCodeScanner onScanResult={handleQRScanResult} onClose={handleCloseScanner} />
      </ModalWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  scanButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanButtonText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  scanButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  scanButtonSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scanResult: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  scanSuccessHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  scanSuccessIcon: {
    marginRight: 12,
  },
  scanSuccessText: {
    flex: 1,
  },
  scanSuccessTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  scanSuccessSubtitle: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  ipContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  ipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  ipValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ipValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
    flex: 1,
    marginRight: 12,
  },
  rescanButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  rescanText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: 4,
  },
})
