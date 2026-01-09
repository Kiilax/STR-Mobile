import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/modules/synchronization/styles/SynchronizationView.styles";
import { useSynchronization } from "@/modules/synchronization/hooks/useSynchronization";
import { useQrCode } from "@/modules/synchronization/hooks/useQRCode";
import { ModalWrapper, QRCodeScanner } from "@/components";
import { useNavigation } from "expo-router";
import { useEventIdStore } from "@/hooks/useEventIdStore";

export default function SynchronizationScreen() {
  const {
    status,
    message,
    hasScannedQR,
    pointsToSync,
    canSync,
    handleSendInterestPoints,
    handleClearData,
    handleReceiveEvent,
  } = useSynchronization();

  const { eventId } = useEventIdStore();

  const {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    resetQrResult,
  } = useQrCode({
    onUrlFound: useCallback(
      async (foundUrl: string, foundEventId: number) => {
        await handleReceiveEvent(foundUrl, foundEventId);
      },
      [handleReceiveEvent]
    ),
  });

  const router = useNavigation();

  const handleDissociateEvent = async () => {
    await handleClearData();
    router.getParent()?.navigate("index");
  };

  const handleValidatedScan = (data: string) => {
    if (!data.includes(";")) return;

    const eventIdStr = data.split(";")[0];
    const scannedId = Number(eventIdStr);

    if (scannedId !== eventId) {
      Alert.alert("Erreur", "Vous vous êtes trompé d'événement");
      setShowQRScanner(false);
      return;
    }

    handleQRScanResult(data);
  };

  const onRescanPress = () => {
    resetQrResult();
    setShowQRScanner(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {!hasScannedQR ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="qr-code-outline"
              size={64}
              color="#FFFFFF"
              style={{ marginBottom: 24 }}
            />
            <Text style={styles.infoText}>
              Scannez le QR Code de l&apos;évènement pour commencer
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowQRScanner(true)}
            >
              <Text style={styles.buttonText}>Scanner</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <TouchableOpacity
              style={[styles.button, !canSync && styles.buttonDisabled]}
              onPress={handleSendInterestPoints}
              disabled={!canSync}
            >
              {status === "syncing" ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {pointsToSync > 0
                    ? `Envoyer les points (${pointsToSync})`
                    : "Aucun point à envoyer"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onRescanPress}
            >
              <Text style={styles.buttonText}>
                Mettre à jour l&apos;événement
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footerContainer}>
        {(status === "success" || status === "error") && (
          <View
            style={[
              styles.statusContainer,
              status === "success" ? styles.successStatus : styles.errorStatus,
            ]}
          >
            <Ionicons
              name={status === "success" ? "checkmark-circle" : "alert-circle"}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.statusText}>{message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleDissociateEvent}
        >
          <Text style={styles.buttonText}>Dissocier l&apos;évènement</Text>
        </TouchableOpacity>
      </View>

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title={hasScannedQR ? "Mettre à jour" : "Scanner"}
          onScanResult={hasScannedQR ? handleValidatedScan : handleQRScanResult}
        />
      </ModalWrapper>
    </View>
  );
}
