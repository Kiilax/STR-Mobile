import { View, Text, Pressable, ActivityIndicator, ScrollView, StyleSheet } from "react-native"
import { colors } from "@/constants/theme"
import { useState } from "react"
import { useMainContext } from "@/context/mainContext"
import { useInterestPointsApi } from "@/hooks"
import QRCode from "@/modules/qr-code"
import { Ionicons } from "@expo/vector-icons"

export default function QRCodeDataDisplay() {
  const { ip, interestPoints, setInterestPoints, deleteAllInterestPoints } = useMainContext()
  const { fetchAll, create, deleteIP } = useInterestPointsApi()

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")

  const hasScannedQR = !!ip
  const pointsToSync = interestPoints.filter((point) => !point.synced || point.updated)
  const hasPointsToSync = pointsToSync.length > 0
  const canSync = hasScannedQR && !isSyncing

  const handleSync = async () => {
    if (!canSync) return

    setIsSyncing(true)
    setSyncStatus("idle")
    setSyncMessage("")

    try {
      if (pointsToSync) {
        for (const interestPoint of interestPoints) {
          if (interestPoint.synced && !interestPoint.updated) {
            continue
          }

          if (!interestPoint.synced && interestPoint.updated) {
            try {
              await deleteIP(interestPoint.id)
              console.log(`Deleted updated point ${interestPoint.id} from server`)
            } catch (error) {
              console.error(`Failed to delete interest point ${interestPoint.id}:`, error)
            }
          }

          const dataToSend = {
            comment: interestPoint.comment,
            latitude: interestPoint.latitude,
            longitude: interestPoint.longitude,
            images: interestPoint.images,
          }
          await create(dataToSend)
          console.log(`Created/uploaded point: ${interestPoint.comment}`)
        }
      }

      deleteAllInterestPoints()
      const newPoints = await fetchAll()

      setInterestPoints(newPoints)

      setSyncStatus("success")
      setSyncMessage(
        hasPointsToSync
          ? "Points d'intérêt synchronisés avec succès"
          : "Données récupérées depuis le serveur"
      )
    } catch (error) {
      setSyncStatus("error")
      setSyncMessage("Échec de la synchronisation")
      console.error("Failed to synchronize interest points:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* En-tête */}
      <View style={styles.header}>
        <Ionicons name="cloud-upload-outline" size={32} color="#007AFF" />
        <Text style={styles.title}>Synchronisation des données</Text>
        <Text style={styles.subtitle}>
          Scannez un QR Code pour synchroniser vos points d&apos;intérêt
        </Text>
      </View>

      {/* Section Scan QR Code */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="qr-code-outline" size={24} color="#333" />
          <Text style={styles.sectionTitle}>Étape 1: Scan du QR Code</Text>
        </View>
        <QRCode />
      </View>

      {/* Section Points à synchroniser */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.sectionTitle}>Étape 2: Points à synchroniser</Text>
        </View>

        <View
          style={[styles.pointsCard, hasPointsToSync ? styles.pointsAvailable : styles.noPoints]}
        >
          <Ionicons
            name={hasPointsToSync ? "warning" : "checkmark-done"}
            size={24}
            color={hasPointsToSync ? "#FF9800" : "#4CAF50"}
          />
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsCount}>
              {hasPointsToSync
                ? `${pointsToSync.length} point(s) d'intérêt en attente`
                : "Aucun point à synchroniser"}
            </Text>
            <Text style={styles.pointsDescription}>
              {hasPointsToSync
                ? "Ces points seront envoyés au serveur lors de la synchronisation"
                : "La synchronisation récupérera les points d'intérêt du serveur"}
            </Text>
          </View>
        </View>
      </View>

      {/* Section Synchronisation */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sync-outline" size={24} color="#333" />
          <Text style={styles.sectionTitle}>Étape 3: Synchronisation</Text>
        </View>

        {!hasScannedQR ? (
          <View style={styles.disabledSyncCard}>
            <Ionicons name="lock-closed" size={24} color="#999" />
            <Text style={styles.disabledSyncText}>
              Scannez un QR Code pour débloquer la synchronisation
            </Text>
          </View>
        ) : (
          <Pressable
            style={[styles.syncButton, !canSync && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={!canSync}
          >
            {isSyncing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.syncButtonText}>
                  {hasPointsToSync ? "Synchronisation..." : "Récupération..."}
                </Text>
              </View>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                <Text style={styles.syncButtonText}>
                  {hasPointsToSync
                    ? "Commencer la synchronisation"
                    : "Récupérer les données du serveur"}
                </Text>
              </>
            )}
          </Pressable>
        )}

        {syncStatus !== "idle" && (
          <View
            style={[
              styles.statusContainer,
              syncStatus === "success" ? styles.successMessage : styles.errorMessage,
            ]}
          >
            <Ionicons
              name={syncStatus === "success" ? "checkmark-circle" : "alert-circle"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={syncStatus === "success" ? styles.successText : styles.errorText}>
              {syncMessage}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: colors.dark.inverted,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.dark.text,
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark.inverted,
    marginLeft: 8,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#1a3a52",
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.tint,
  },
  successCard: {
    backgroundColor: "#1a3d2e",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    color: colors.dark.inverted,
  },
  qrDataContainer: {
    backgroundColor: colors.dark.primary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3440",
  },
  qrDataLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.dark.text,
    marginBottom: 4,
  },
  qrDataText: {
    fontSize: 14,
    color: colors.dark.inverted,
    fontFamily: "monospace",
  },
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  pointsAvailable: {
    backgroundColor: "#3d2e1a",
    borderColor: "#FF9800",
  },
  noPoints: {
    backgroundColor: "#1a3d2e",
    borderColor: "#4CAF50",
  },
  pointsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pointsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.inverted,
    marginBottom: 4,
  },
  pointsDescription: {
    fontSize: 14,
    color: colors.dark.text,
    lineHeight: 18,
  },
  disabledSyncCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.dark.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3440",
    borderStyle: "dashed",
  },
  disabledSyncText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    textAlign: "center",
  },
  syncButton: {
    backgroundColor: colors.dark.tint,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: colors.dark.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  syncButtonDisabled: {
    backgroundColor: "#3a3a3a",
    shadowOpacity: 0,
  },
  syncButtonText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  successMessage: {
    backgroundColor: "#4CAF50",
  },
  errorMessage: {
    backgroundColor: "#F44336",
  },
  successText: {
    color: "white",
    fontWeight: "600",
  },
  errorText: {
    color: "white",
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.inverted,
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.dark.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 14,
    color: colors.dark.text,
    flex: 1,
  },
})
