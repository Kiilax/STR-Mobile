import {
  ModalWrapper,
  QRCodeScanner,
  ErrorModal,
  Button,
  LoadingModal,
} from "@/components";
import { StyleSheet, Image, View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { colors } from "@/constants/theme";
import { useQrCode, useSynchronization } from "@/modules/synchronization/hooks";
import { QRCodeContent } from "@/types/qrCodeContent";
import { useAlertModal, useLoadingModal } from "@/hooks";
import { useUrlStore } from "@/hooks/useUrlStore";
import useQRCodeStore from "@/hooks/useQRCodeStore";

export default function EventScanner() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const isProcessingRef = useRef(false);
  const { eventId, eventIdLoading } = useEventIdStore();
  const hasNavigated = useRef(false);
  const router = useRouter();
  const { handleReceiveEvent } = useSynchronization();
  const { alertState, showError, hideAlert } = useAlertModal();
  const { loadingState, showLoading, hideLoading } = useLoadingModal();

  const { setCurrentTeamId } = useTeamActionsStore();

  const { handleQRScanResult } = useQrCode({
    onError: showError,
  });

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleScan = async (parsedData: QRCodeContent | null) => {
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

    setShowQRScanner(false);
    isProcessingRef.current = true;
    showLoading(
      "Connexion en cours",
      "Vérification de la connexion au serveur..."
    );

    const success = await handleQRScanResult(JSON.stringify(parsedData));

    if (success) {
      if (hasNavigated.current) {
        hideLoading();
        isProcessingRef.current = false;
        return;
      }
      hasNavigated.current = true;

      const foundUrl = useUrlStore.getState().url;
      const foundEventId = useQRCodeStore.getState().scannedEventId;
      const foundTeamId = useQRCodeStore.getState().scannedTeamId;

      if (foundUrl && foundEventId) {
        await handleReceiveEvent(
          foundUrl,
          foundEventId,
          foundTeamId || undefined
        );

        if (foundTeamId) {
          await setCurrentTeamId(foundTeamId);
        }
      }

      hideLoading();
      isProcessingRef.current = false;
      router.navigate({
        pathname: "/(tabs)",
        params: { zoomToEvent: "true" },
      });
    } else {
      hideLoading();
      isProcessingRef.current = false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      hasNavigated.current = false;
      isProcessingRef.current = false;
    }, [])
  );

  useEffect(() => {
    if (eventIdLoading || isProcessingRef.current) return;

    if (!eventId) {
      hasNavigated.current = false;
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
            source={require("@assets/images/stras-ta-route.png")}
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
          source={require("@assets/images/stras-ta-route.png")}
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
