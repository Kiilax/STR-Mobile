import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { useSynchronization } from "@/modules/synchronization/hooks/useSynchronization";
import { useQrCode } from "@/hooks/useQRCode";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { useAlertModal, useLoadingModal } from "@/hooks";

import {
  ModalWrapper,
  QRCodeScanner,
  ErrorModal,
  Button,
  LoadingModal,
} from "@/components";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { styles } from "@/modules/synchronization/styles/SynchronizationView.styles";

export default function SynchronizationScreen() {
  const navigation = useNavigation();
  const { eventId } = useEventIdStore();
  const { alertState, showError, showWarning, hideAlert } = useAlertModal();
  const { loadingState, showLoading, hideLoading } = useLoadingModal();

  const eventIdRef = useRef(eventId);
  eventIdRef.current = eventId;

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

  const { setCurrentTeamId, resetTeamActions } = useTeamActionsStore();

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

        const currentEventId = eventIdRef.current;
        if (
          foundTeamId &&
          (!currentEventId || currentEventId === foundEventId)
        ) {
          await setCurrentTeamId(foundTeamId);
        }

        navigation.getParent()?.navigate("index");
      },
      [handleReceiveEvent, setCurrentTeamId, navigation]
    ),
    onError: showError,
    onLoadingStart: useCallback(
      () =>
        showLoading(
          "Connexion en cours",
          "Vérification de la connexion au serveur..."
        ),
      [showLoading]
    ),
    onLoadingEnd: hideLoading,
  });

  const handleScan = (parsedData: QRCodeContent | null) => {
    if (!parsedData) {
      showError("Erreur", "QR Code invalide ou format non reconnu");
      return;
    }

    const scannedId = Number(parsedData.eventId);

    if (isNaN(scannedId)) {
      showError("Erreur", "ID d'évènement invalide dans le QR Code");
      return;
    }

    if (eventId && scannedId !== eventId) {
      showError(
        "Erreur d'évènement",
        "Ce QR Code correspond à un évènement différent de celui en cours. Veuillez dissocier l'évènement actuel avant d'en changer."
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
      "Dissocier l'évènement ?",
      "Cela effacera les données locales liées à l'évènement et vous ramènera à l'accueil.",
      [
        { text: "Annuler", style: "secondary" },
        {
          text: "Dissocier",
          style: "danger",
          onPress: async () => {
            await handleClearData(async () => resetTeamActions());
            navigation.getParent()?.navigate("index");
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
          <View
            style={[
              styles.centerContent,
              { justifyContent: "center", flex: 1 },
            ]}
          >
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
          <>
            <View
              style={[
                styles.centerContent,
                { justifyContent: "center", flex: 1 },
              ]}
            >
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
                title="Mettre à jour l'évènement"
                variant="secondary"
                onPress={handleRescanPress}
                fullWidth
                style={{ marginTop: 12 }}
              />
            </View>

            <View style={styles.footerContainer}>
              {(status === "success" || status === "error") && (
                <View
                  style={[
                    styles.statusContainer,
                    status === "success"
                      ? styles.successStatus
                      : styles.errorStatus,
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
              />
            </View>
          </>
        )}
      </View>

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title={hasScannedQR ? "Mise à jour Connexion" : "Connexion Évènement"}
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

      <LoadingModal
        visible={loadingState.visible}
        title={loadingState.title}
        message={loadingState.message}
      />
    </SafeAreaView>
  );
}
