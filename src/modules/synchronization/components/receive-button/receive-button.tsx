import { Pressable, Text, View, ActivityIndicator } from "react-native"
import { styles } from "./receive-button.styles"
import { useReceiveEvent } from "@/modules/synchronization/hooks/useSynchronization"
import { Ionicons } from "@expo/vector-icons"

export default function ReceiveButton() {
  const { status: receiveStatus, handleSync: handleReceiveSync } = useReceiveEvent()

  return (
    <Pressable
      style={[styles.receiveButton, receiveStatus !== "idle" && styles.receiveButtonDisabled]}
      onPress={handleReceiveSync}
      disabled={receiveStatus !== "idle"}
    >
      {receiveStatus === "syncing" ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.receiveButtonText}>Récupération...</Text>
        </View>
      ) : (
        <>
          <Ionicons name="cloud-download" size={20} color="#FFFFFF" />
          <Text style={styles.receiveButtonText}>Récupérer les données d&apos;événement</Text>
        </>
      )}
    </Pressable>
  )
}
