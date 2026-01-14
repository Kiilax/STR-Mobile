import {
  ModalWrapper,
  QRCodeScanner,
  ErrorModal,
  Button,
  LoadingModal,
} from "@/components";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import { colors } from "@/constants/theme";
import { useQrCode, useSynchronization } from "@/modules/synchronization/hooks";
import { QRCodeContent } from "@/types/qrCodeContent";
import { useAlertModal, useLoadingModal } from "@/hooks";

export default function EventScanner() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [teamIdState, setTeamIdState] = useState<string | null>(null);
  const { eventId, eventIdLoading } = useEventIdStore();
  const hasNavigated = useRef(false);
  const router = useRouter();
  const { handleReceiveEvent } = useSynchronization();
  const { alertState, showError, hideAlert } = useAlertModal();
  const { loadingState, showLoading, hideLoading } = useLoadingModal();

  const { setTeamActionsFromApi, setCurrentTeamId } = useTeamActionsStore();
  const apiTeamId = teamIdState ? parseInt(teamIdState, 10) : 0;
  const { fetchTeamActions } = useTeamActionsApi(
    apiTeamId,
    eventId ? eventId : 0
  );

  const onUrlFound = useCallback(
    async (
      foundUrl: string,
      foundEventId: number,
      foundTeamId: string | null
    ) => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;

      await handleReceiveEvent(foundUrl, foundEventId);

      if (foundTeamId) {
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

      router.navigate("/(tabs)");
    },
    [
      handleReceiveEvent,
      fetchTeamActions,
      setTeamActionsFromApi,
      setCurrentTeamId,
      router,
    ]
  );

  const { handleQRScanResult } = useQrCode({
    onUrlFound,
    onError: showError,
    onLoadingStart: useCallback(
      () => showLoading("Connexion en cours", "Vérification de la connexion au serveur..."),
      [showLoading]
    ),
    onLoadingEnd: hideLoading,
  });

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

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

  useEffect(() => {
    if (eventIdLoading) return;

    if (!eventId) {
      setShowQRScanner(true);
    } else {
      router.replace("/(tabs)");
    }
  }, [eventIdLoading, eventId, router]);

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.title}>Stras&apos;ta route</Text>
      {!eventId && (
        <Button
          title="Scanner le QR Code"
          onPress={() => setShowQRScanner(true)}
          style={{ marginTop: 20 }}
        />
      )}
      {!eventId && (
        <ModalWrapper
          visible={showQRScanner}
          onClose={handleCloseScanner}
          overlayOpacity={1}
        >
          <QRCodeScanner title="Synchroniser" onScanResult={handleScan} />
        </ModalWrapper>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.dark.text,
  },
});
