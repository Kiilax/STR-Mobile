import { CameraView } from "expo-camera"
import { StatusBar } from "expo-status-bar"
import { TouchableOpacity, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useQRScanner } from "@/modules/synchronization/hooks/useQRScanner"
import { colors } from "@/constants/theme"
import { styles } from "./qr-code-scanner.styles"

interface QRCodeScannerProps {
  title: string
  onScanResult: (ip: string) => void
  onClose?: () => void
}

export default function QRCodeScanner({ title, onScanResult, onClose }: QRCodeScannerProps) {
  const { isGranted, loading, error } = useQRScanner()

  const handleScanResult = ({ data }: { data: string }) => {
    onScanResult(data)
    onClose?.()
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.dark.text} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color={colors.dark.tint} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    )
  }

  if (!isGranted) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.dark.text} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>
          <View style={styles.errorContainer}>
            <Ionicons name="camera-outline" size={64} color={colors.dark.accent} />
            <Text style={styles.errorTitle}>Accès caméra requis</Text>
            <Text style={styles.errorDescription}>
              L&apos;accès à la caméra est nécessaire pour scanner les codes QR.
            </Text>
            {error && <Text style={styles.errorText}>Erreur: {error.message}</Text>}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Pointez la caméra vers le code QR pour le scanner
          </Text>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleScanResult}
          />
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
        </View>
      </View>
    </View>
  )
}
