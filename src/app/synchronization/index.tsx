// index.tsx
import { View, Text, Pressable, ActivityIndicator, ScrollView } from "react-native"
import { styles } from "./styles"
import { useState } from "react"
import { useMainContext } from "@/src/context/mainContext"
import { useInterestPointsApi } from "@/src/hooks"
import QRCode from "@/src/components/qr-code/QRCode"
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

      {/* Informations supplémentaires */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Comment synchroniser ?</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Scannez le QR Code du site</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              {hasPointsToSync
                ? "Vos points locaux seront envoyés au serveur"
                : "Les points du serveur seront récupérés"}
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Les données sont mises à jour des deux côtés</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
