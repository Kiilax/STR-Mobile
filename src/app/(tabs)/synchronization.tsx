import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { useSynchronization } from "@/modules/synchronization/hooks/useSynchronization";
import { useQrCode } from "@/hooks/useQRCode";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import { useAlertModal } from "@/hooks";

import {
  ModalWrapper,
  QRCodeScanner,
  ErrorModal,
  Button,
} from "@/components";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { styles } from "@/modules/synchronization/styles/SynchronizationView.styles";

export default function SynchronizationScreen() {
  const router = useNavigation();
  const { eventId } = useEventIdStore();
  const { alertState, showError, showWarning, hideAlert } = useAlertModal();

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

  const { setTeamActionsFromApi, setCurrentTeamId, resetTeamActions } =
    useTeamActionsStore();
  const [teamIdState, setTeamIdState] = useState<string | null>(null);

  const apiTeamId = teamIdState ? parseInt(teamIdState, 10) : 0;
  const { fetchTeamActions } = useTeamActionsApi(
    apiTeamId,
    eventId ? eventId : 0
  );

  const {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
  } = useQrCode({
    onUrlFound: useCallback(
      async (
        foundUrl: string,
        foundEventId: number,
        foundTeamId: string | null
      ) => {
        await handleReceiveEvent(foundUrl, foundEventId);

        if (foundTeamId && eventId === foundEventId) {
          setTeamIdState(foundTeamId);
          setCurrentTeamId(foundTeamId);
          try {
            const response = await fetchTeamActions();
            if (response) {
              await setTeamActionsFromApi(response);
            }
          } catch (error) {
            console.error("Erreur fetch actions:", error);
          }
        }
      },
      [
        handleReceiveEvent,
        eventId,
        fetchTeamActions,
        setTeamActionsFromApi,
        setCurrentTeamId,
      ]
    ),
    onError: showError,
  });

  const handleScan = (parsedData: QRCodeContent | null) => {
    if (!parsedData) {
      showError("Erreur", "QR Code invalide ou format non reconnu");
      return;
    }

    const scannedId = Number(parsedData.eventId);

    if (isNaN(scannedId)) {
      showError("Erreur", "ID d'événement invalide dans le QR Code");
      return;
    }

    if (eventId && scannedId !== eventId) {
      showError(
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
    showWarning(
      "Dissocier l'événement ?",
      "Cela effacera les données locales liées à l'événement et vous ramènera à l'accueil.",
      [
        { text: "Annuler", style: "secondary" },
        {
          text: "Dissocier",
          style: "danger",
          onPress: async () => {
            await handleClearData(async () => resetTeamActions());
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
            <Button
              title="Scanner le QR Code"
              onPress={() => setShowQRScanner(true)}
              fullWidth
            />
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

            <Button
              title={
                status === "syncing"
                  ? "Synchronisation..."
                  : pointsToSync > 0
                    ? "Envoyer maintenant"
                    : "Tout est synchronisé"
              }
              variant={pointsToSync === 0 ? "secondary" : "primary"}
              onPress={handleSendInterestPoints}
              disabled={!canSync || status === "syncing"}
              loading={status === "syncing"}
              fullWidth
            />

            <Button
              title="Mettre à jour l'événement"
              variant="secondary"
              onPress={handleRescanPress}
              fullWidth
              style={{ marginTop: 12 }}
            />
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

        <Button
          title="Dissocier l'évènement"
          variant="danger"
          onPress={handleDissociateAndExit}
          fullWidth
          style={{ marginTop: 10 }}
        />
      </View>

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title={hasScannedQR ? "Mise à jour Connexion" : "Connexion Événement"}
          onScanResult={handleScan}
        />
      </ModalWrapper>

      <ErrorModal
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}
