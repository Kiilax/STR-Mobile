import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMainContext } from "@/context/mainContext"
import { styles } from "./points-info.styles"
import { commonStyles } from "../../styles/common.styles"


export default function PointsInfo() {
  const { interestPoints } = useMainContext()
  const pointsToSync = interestPoints.filter((point) => !point.synced || point.updated)
  const hasPointsToSync = pointsToSync.length > 0

    return (
        <View style={commonStyles.section}>
            {/* Section Points à synchroniser */}
            <View style={commonStyles.sectionHeader}>
                <Ionicons name="location-outline" size={24} color="#333" />
                <Text style={commonStyles.sectionTitle}>Étape 2: Points à synchroniser</Text>
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
    )
}