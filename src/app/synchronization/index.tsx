import { View, Text, Pressable, ActivityIndicator } from "react-native"
import { useQRStore } from "@/src/store/QRCode"
import { useReactiveAsyncStore } from "@/src/hooks"
import { keys } from "@/src/config"
import { createInterestPoint, fetchInterestPoints } from "@/src/api"
import { InterestPoint } from "@/src/types"
import { styles } from "./index.styles"
import { useState } from "react"

export default function QRCodeDataDisplay() {
  const qrData = useQRStore((state) => state.qrData)
  const { value, setValue } = useReactiveAsyncStore<InterestPoint[] | null>(
    keys.interestPoints,
    null
  )

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")

  const handleSync = async () => {
    if (!value || value.length === 0 || isSyncing) return
    setIsSyncing(true)
    setSyncStatus("idle")
    setSyncMessage("")
    try {
      for (const interestPoint of value) {
        const dataToSend = {
          comment: interestPoint.comment,
          latitude: interestPoint.latitude,
          longitude: interestPoint.longitude,
          images: interestPoint.images,
        }

        await createInterestPoint(dataToSend)
        const interestPoints = await fetchInterestPoints()
        await setValue(interestPoints)
      }
      setSyncStatus("success")
      setSyncMessage("Points d'intérêt synchronisés avec succès")
    } catch (error) {
      setSyncStatus("error")
      setSyncMessage("Échec de la synchronisation")
      console.error("Failed to synchronize interest points:", error)
    } finally {
      setIsSyncing(false)

      setTimeout(() => {
        setSyncStatus("idle")
        setSyncMessage("")
      }, 3000)
    }
  }

  const isSyncDisabled = !value || isSyncing

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synchronisation des QR Codes</Text>

      <Pressable
        style={[styles.syncButton, isSyncDisabled && styles.syncButtonDisabled]}
        onPress={handleSync}
        disabled={isSyncDisabled}
      >
        {isSyncing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.syncButtonText}>Synchronisation...</Text>
          </View>
        ) : (
          <Text style={styles.syncButtonText}>Commencer la synchronisation</Text>
        )}
      </Pressable>

      {syncStatus !== "idle" && (
        <View
          style={[
            styles.statusContainer,
            syncStatus === "success" ? styles.successMessage : styles.errorMessage,
          ]}
        >
          <Text style={syncStatus === "success" ? styles.successText : styles.errorText}>
            {syncMessage}
          </Text>
        </View>
      )}

      <View style={styles.qrDataContainer}>
        <Text style={styles.qrDataLabel}>Données du QR Code:</Text>
        <Text style={styles.qrDataText} numberOfLines={2} ellipsizeMode="middle">
          {qrData || "Aucune donnée QR code scannée"}
        </Text>
      </View>

      {value && value.length > 0 && (
        <View style={[styles.qrDataContainer, { marginTop: 12 }]}>
          <Text style={styles.qrDataLabel}>
            Points d&apos;intérêt à synchroniser:
            <Text style={{ color: "#007AFF", fontWeight: "bold" }}> {value.length}</Text>
          </Text>
        </View>
      )}
    </View>
  )
}
