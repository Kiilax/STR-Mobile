import {
  ModalWrapper,
  QRCodeScanner,
  ErrorModal,
  Button,
  LoadingModal,
} from "@/components";
import { StyleSheet, Image, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { colors } from "@/constants/theme";
import { useQrCode, useSynchronization } from "@/modules/synchronization/hooks";
import { QRCodeContent } from "@/types/qrCodeContent";
import { useAlertModal, useLoadingModal } from "@/hooks";

export default function EventScanner() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { eventId, eventIdLoading } = useEventIdStore();
  const hasNavigated = useRef(false);
  const router = useRouter();
  const { handleReceiveEvent } = useSynchronization();
  const { alertState, showError, hideAlert } = useAlertModal();
  const { loadingState, showLoading, hideLoading } = useLoadingModal();

  const { setCurrentTeamId } = useTeamActionsStore();

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
        await setCurrentTeamId(foundTeamId);
      }

      router.navigate({
        pathname: "/(tabs)",
        params: { zoomToEvent: "true" },
      });
    },
    [handleReceiveEvent, setCurrentTeamId, router]
  );

  const { handleQRScanResult } = useQrCode({
    onUrlFound,
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

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleScan = (parsedData: QRCodeContent | null) => {
    if (!parsedData) {
      showError(
        "Erreur",
        "Le QR Code scanné est invalide. Veuillez en genérer un nouveau."
      );
      return;
    }

    const scannedId = Number(parsedData.eventId);

    if (isNaN(scannedId)) {
      showError(
        "Erreur",
        "Le QR Code scanné est invalide. Veuillez en genérer un nouveau."
      );
      return;
    }

    if (eventId && scannedId !== eventId) {
      showError(
        "Erreur d'évènement",
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
      router.replace({
        pathname: "/(tabs)",
        params: { zoomToEvent: "true" },
      });
    }
  }, [eventIdLoading, eventId, router]);

  if (eventIdLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@assets/images/stras-ta-route.webp")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@assets/images/stras-ta-route.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
  },
});
