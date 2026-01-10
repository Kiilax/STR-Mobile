import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQRScanner } from "@/hooks/useQRScanner";
import { colors } from "@/constants/theme";
import { styles } from "./qr-code-scanner.styles";
import type { QRCodeContent } from "@/types/qrCodeContent";

interface QRCodeScannerProps {
  title: string;
  onScanResult: (data: QRCodeContent | null, rawData?: string) => void;
  showRawData?: boolean;
}

export default function QRCodeScanner({
  title,
  onScanResult,
  showRawData = false,
}: QRCodeScannerProps) {
  const { isGranted, loading, error } = useQRScanner();

  const parseQRCodeData = (data: string): QRCodeContent | null => {
    try {
      const parsedData = JSON.parse(data);

      if (!parsedData || typeof parsedData !== 'object') {
        console.warn("Données QR Code invalides: pas un objet JSON");
        return null;
      }

      if (!parsedData.eventId || !parsedData.ips) {
        console.warn("Données QR Code invalides: eventId ou ips manquant");
        return null;
      }

      if (typeof parsedData.eventId !== 'string') {
        console.warn("Données QR Code invalides: eventId doit être une string");
        return null;
      }

      if (!Array.isArray(parsedData.ips) && typeof parsedData.ips !== 'string') {
        console.warn("Données QR Code invalides: ips doit être un tableau ou une string");
        return null;
      }

      let normalizedIps: string[];
      if (Array.isArray(parsedData.ips)) {
        normalizedIps = parsedData.ips;
      } else {
        console.error("Données QR Code: ips est une string, conversion en tableau");
        return null;
      }

      if ('teamId' in parsedData && parsedData.teamId) {
        if (typeof parsedData.teamId !== 'string') {
          console.warn("Données QR Code invalides: teamId doit être une string");
          return null;
        }
        
        return {
          eventId: parsedData.eventId,
          ips: normalizedIps,
          teamId: parsedData.teamId,
        };
      }

      return {
        eventId: parsedData.eventId,
        ips: normalizedIps,
      };

    } catch (error) {
      console.error("Échec du parsing JSON du QR Code:", error);
      return null;
    }
  };

  const handleScanResult = ({ data }: { data: string }) => {
    console.log("QR Code brut scanné:", data);
    
    const parsedData = parseQRCodeData(data);
    
    if (parsedData) {
      console.log("QR Code parsé:", parsedData);
      onScanResult(parsedData, showRawData ? data : undefined);
    } else {
      console.warn("QR Code invalide ou format non reconnu");
      onScanResult(null, data);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color={colors.dark.tint} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!isGranted) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.errorContainer}>
            <Ionicons
              name="camera-outline"
              size={64}
              color={colors.dark.accent}
            />
            <Text style={styles.errorTitle}>Accès caméra requis</Text>
            <Text style={styles.errorDescription}>
              L&apos;accès à la caméra est nécessaire pour scanner les codes QR.
            </Text>
            {error && (
              <Text style={styles.errorText}>Erreur: {error.message}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
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
        <Text style={styles.instructionText}>
          Pointez la caméra vers le code QR pour le scanner
        </Text>
      </View>
    </View>
  );
}