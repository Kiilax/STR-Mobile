import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "./step-card.styles"

export default function StepCard() {
  return (
        <View>
            {/* En-tête */}
            <View style={styles.header}>
                <Ionicons name="cloud-upload-outline" size={32} color="#007AFF" />
                <Text style={styles.title}>Synchronisation des données</Text>
                <Text style={styles.subtitle}>
                Scannez un QR Code pour synchroniser vos points d&apos;intérêt
                </Text>
            </View>
        </View>
    )
}