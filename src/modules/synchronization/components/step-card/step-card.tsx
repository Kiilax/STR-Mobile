import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import QRCode from "../qr-code/qr-code"
import { styles } from "./step-card.styles"
import { commonStyles } from "../../styles/common.styles"

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

            {/* Section Scan QR Code */}
            <View style={commonStyles.section}>
                <View style={commonStyles.sectionHeader}>
                <Ionicons name="qr-code-outline" size={24} color="#333" />
                <Text style={commonStyles.sectionTitle}>Étape 1: Scan du QR Code</Text>
                </View>
                <QRCode />
            </View>
        </View>
    )
}