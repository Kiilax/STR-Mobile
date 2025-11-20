import { View, Text, Pressable, ActivityIndicator } from "react-native"
import { styles } from "./index.styles"
import { useState } from "react"
import { useMainContext } from "@/src/context/mainContext"
import { useInterestPointsApi } from "@/src/hooks"

export default function QRCodeDataDisplay() {
  const { ip, interestPoints, setInterestPoints, deleteAllInterestPoints } = useMainContext()
  const { fetchAll, create } = useInterestPointsApi()

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")

  const handleSync = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    setSyncStatus("idle")
    setSyncMessage("")
    try {
      for (const interestPoint of interestPoints) {
        if (interestPoint.synced) continue
        const dataToSend = {
          comment: interestPoint.comment,
          latitude: interestPoint.latitude,
          longitude: interestPoint.longitude,
          images: interestPoint.images,
        }
        await create(dataToSend)
      }
      const newPoints = await fetchAll()
      if (newPoints.length > 0) {
        deleteAllInterestPoints()
      }
      setInterestPoints(newPoints)
      setSyncStatus("success")
      setSyncMessage("Points d'intérêt synchronisés avec succès")
    } catch (error) {
      setSyncStatus("error")
      setSyncMessage("Échec de la synchronisation")
      console.error("Failed to synchronize interest points:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synchronisation des QR Codes</Text>

      <Pressable
        style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
        onPress={handleSync}
        disabled={isSyncing}
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
          {ip || "Aucune donnée QR code scannée"}
        </Text>
      </View>

      {interestPoints.length > 0 && (
        <View style={[styles.qrDataContainer, { marginTop: 12 }]}>
          <Text style={styles.qrDataLabel}>
            Points d&apos;intérêt à synchroniser:
            <Text style={{ color: "#007AFF", fontWeight: "bold" }}> {interestPoints.length}</Text>
          </Text>
        </View>
      )}
    </View>
  )
}
