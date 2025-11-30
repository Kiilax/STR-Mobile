import { Pressable, Text, View, ActivityIndicator } from "react-native"
import { styles } from "./sync-button.styles"
import { useSynchronization } from "@/modules/synchronization/hooks/useSynchronization"
import { Ionicons } from "@expo/vector-icons"


export default function SyncButton() {
    const { status, pointsToSync, canSync, handleSync } = useSynchronization()
    return (
        <Pressable
            style={[styles.syncButton, !canSync && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={!canSync}
            >
            {status === "syncing" ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.syncButtonText}>
                    {pointsToSync > 0 ? "Synchronisation..." : "Récupération..."}
                </Text>
                </View>
            ) : (
                <>
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                <Text style={styles.syncButtonText}>
                    {pointsToSync > 0
                    ? "Commencer la synchronisation"
                    : "Récupérer les données du serveur"}
                </Text>
                </>
            )}
        </Pressable>
    )
}