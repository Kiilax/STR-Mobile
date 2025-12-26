import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { styles } from "./send-button.styles";
import { useSendInterestPoints } from "@/modules/synchronization/hooks/useSynchronization";
import { Ionicons } from "@expo/vector-icons";

export default function SyncButton() {
  const { status, pointsToSync, canSync, handleSync } = useSendInterestPoints();
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
              : "Envoyer les points d'intérêt"}
          </Text>
        </>
      )}
    </Pressable>
  );
}
