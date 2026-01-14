import { useCallback } from "react";
import { useUrlStore } from "@/hooks/useUrlStore";
import useQRCodeStore from "@/hooks/useQRCodeStore";
import type { QRCodeContent } from "@/types/qrCodeContent";

interface UseQrCodeProps {
  onUrlFound?: (
    url: string,
    eventId: number,
    teamId: string | null
  ) => void | Promise<void>;
  onError?: (title: string, message: string) => void;
  onLoadingStart?: () => void;
  onLoadingEnd?: () => void;
}

export const useQrCode = ({
  onUrlFound,
  onError,
  onLoadingStart,
  onLoadingEnd,
}: UseQrCodeProps = {}) => {
  const { url, setUrl } = useUrlStore();
  const { showScanner, setShowScanner, processScanResult, reset } =
    useQRCodeStore();

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, [setShowScanner]);

  const handleQRScanResult = async (data: string | QRCodeContent) => {
    try {
      const parsedData = (
        typeof data === "string" ? JSON.parse(data) : data
      ) as QRCodeContent;

      onLoadingStart?.();
      const success = await processScanResult(parsedData);
      onLoadingEnd?.();

      if (success) {
        const currentUrl = useUrlStore.getState().url;
        const currentEventId = useQRCodeStore.getState().scannedEventId;
        const currentTeamId = useQRCodeStore.getState().scannedTeamId;

        if (currentUrl && currentEventId) {
          await onUrlFound?.(currentUrl, currentEventId, currentTeamId);
        }
      } else {
        const error = useQRCodeStore.getState().error;
        onError?.("Erreur", error || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur parsing QR:", error);
      onError?.("Erreur", "QR Code invalide: format JSON incorrect");
      onLoadingEnd?.();
    }
  };

  const handleScanAgain = async () => {
    await setUrl("");
    reset();
  };

  return {
    showQRScanner: showScanner,
    setShowQRScanner: setShowScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
    url,
    resetQrResult: reset,
  };
};
