import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { useSynchronization } from "@/modules/synchronization/hooks/useSynchronization";
import { useQrCode } from "@/hooks/useQRCode";
import { useEventIdStore } from "@/hooks/useEventIdStore";

import { ModalWrapper, QRCodeScanner } from "@/components";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { styles } from "@/modules/synchronization/styles/SynchronizationView.styles";

export default function SynchronizationScreen() {
  const router = useNavigation();
  const { eventId } = useEventIdStore();

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

  const {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
  } = useQrCode({
    onUrlFound: useCallback(
      async (foundUrl: string, foundEventId: number) => {
        await handleReceiveEvent(foundUrl, foundEventId);
      },
      [handleReceiveEvent]
    ),
  });

  const handleScan = (parsedData: QRCodeContent | null) => {
    if (!parsedData) {
      Alert.alert("Erreur", "QR Code invalide ou format non reconnu");
      return;
    }

    const scannedId = Number(parsedData.eventId);

    if (isNaN(scannedId)) {
      Alert.alert("Erreur", "ID d'événement invalide dans le QR Code");
      return;
    }

    if (eventId && scannedId !== eventId) {
      Alert.alert(
        "Erreur d'événement",
        "Ce QR Code correspond à un événement différent de celui en cours. Veuillez dissocier l'événement actuel avant d'en changer."
      );
      setShowQRScanner(false);
      return;
    }

    handleQRScanResult(JSON.stringify(parsedData));
  };

  const handleRescanPress = () => {
    handleScanAgain();
    setShowQRScanner(true);
  };

  const handleDissociateAndExit = async () => {
    Alert.alert(
      "Dissocier l'événement ?",
      "Cela effacera les données locales liées à l'événement et vous ramènera à l'accueil.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Dissocier",
          style: "destructive",
          onPress: async () => {
            await handleClearData();
            router.getParent()?.navigate("index");
          },
        },
      ]
    );
  };

  const getStatusIcon = () => {
    switch (status) {
      case "syncing":
        return "cloud-upload";
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      default:
        return "cloud-offline-outline";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {!hasScannedQR ? (
          <View style={styles.centerContent}>
            <Ionicons
              name="qr-code-outline"
              size={100}
              color="#FFFFFF"
              style={{ opacity: 0.5, marginBottom: 24 }}
            />
            <Text style={styles.infoText}>
              Scannez le QR Code administrateur pour synchroniser vos points
              d&apos;intérêt.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowQRScanner(true)}
            >
              <Text style={styles.buttonText}>Scanner le QR Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <View style={{ marginBottom: 40, alignItems: "center" }}>
              <Ionicons
                name="location"
                size={60}
                color={pointsToSync > 0 ? "#4CAF50" : "#ccc"}
              />
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 32,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
              >
                {pointsToSync}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>
                Points à synchroniser
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !canSync && pointsToSync > 0 && { opacity: 0.7 },
                pointsToSync === 0 && styles.buttonSecondary,
              ]}
              onPress={handleSendInterestPoints}
              disabled={!canSync || status === "syncing"}
            >
              {status === "syncing" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.buttonText}>Synchronisation...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>
                  {pointsToSync > 0
                    ? "Envoyer maintenant"
                    : "Tout est synchronisé"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary, { marginTop: 12 }]}
              onPress={handleRescanPress}
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
              name={getStatusIcon()}
              size={24}
              color="#FFFFFF"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.statusText}>{message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger, { marginTop: 10 }]}
          onPress={handleDissociateAndExit}
        >
          <Text style={styles.buttonText}>Dissocier l&apos;évènement</Text>
        </TouchableOpacity>
      </View>

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title={hasScannedQR ? "Mise à jour Connexion" : "Connexion Événement"}
          onScanResult={handleScan}
        />
      </ModalWrapper>
    </SafeAreaView>
  );
}
