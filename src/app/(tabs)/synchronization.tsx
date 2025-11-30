import { View, Text, Pressable, ActivityIndicator, ScrollView, StyleSheet } from "react-native"
import { colors } from "@/constants/theme"
import { useState } from "react"
import { useMainContext } from "@/context/mainContext"
import { Ionicons } from "@expo/vector-icons"
import { StepCard, PointsInfo } from "@/modules/synchronization/components"
import { SyncButton } from "@/modules/synchronization/components"

export default function QRCodeDataDisplay() {
  const { ip, interestPoints } = useMainContext()
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [syncMessage, setSyncMessage] = useState("")

  const hasScannedQR = !!ip

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <StepCard />
      
      <PointsInfo />

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
          <SyncButton />
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
