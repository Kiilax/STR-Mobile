import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import QRCode from "../qr-code/qr-code"
import { commonStyles } from "../../styles/common.styles"

export default function QRCodeCard() {
  return (
        <View>
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