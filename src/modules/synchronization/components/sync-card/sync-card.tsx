import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./sync-card.styles"
import SyncButton from "../sync-button/sync-button"
import { commonStyles } from "../../styles/common.styles"
import { useMainContext } from "@/context/mainContext"

export default function SyncCard() {
  const { ip } = useMainContext()
  const hasScannedQR = !!ip

  return (
      <View style={commonStyles.section}>
        <View style={commonStyles.sectionHeader}>
          <Ionicons name="sync-outline" size={24} color="#333" />
          <Text style={commonStyles.sectionTitle}>Étape 3: Synchronisation</Text>
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
        </View>
    )
}