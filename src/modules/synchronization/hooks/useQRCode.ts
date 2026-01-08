import { useRef, useState, useEffect } from "react";
import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { QRCodeContent } from "@/types/QRCodeContent";

interface UseQrCodeProps {
  onUrlFound?: (url: string, eventId: number) => void | Promise<void>;
}

export const useQrCode = ({ onUrlFound }: UseQrCodeProps = {}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { url, setUrl } = useUrlStore();
  const { setEventId } = useEventIdStore();
  const [qrResult, setQrResult] = useState<string[] | null>(null);
  const scannedEventId = useRef<number | null>(null);

  const fetchWithTimeout = (url: string, options: any = {}, timeout = 800) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      ),
    ]);
  };

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleQRScanResult = (data: string) => {
    try {
      const qrContent = JSON.parse(data) as QRCodeContent;
      console.log(qrContent)
      
      if (!qrContent.ips || !Array.isArray(qrContent.ips)) {
        console.error("Invalid QR code format: missing ips array");
        return;
      }

      let eventId = 0;
      if (qrContent.eventId) {
        eventId = Number(qrContent.eventId);
        if (isNaN(eventId)) {
          console.error("Invalid eventId format");
          return;
        }
      }

      scannedEventId.current = eventId;
      setEventId(eventId);
      setQrResult(qrContent.ips);
      setShowQRScanner(false);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const checkIps = async (ips: string[]): Promise<string | null> => {
    if (!ips || ips.length === 0) return null;
    
    for (const ip of ips) {
      try {
        const response = (await fetchWithTimeout(
          `http://${ip}`,
          { method: "GET" },
          400
        )) as Response;
        if (response.ok) {
          console.log(`Valid URL found: http://${ip}`);
          return `http://${ip}`;
        }
      } catch (err) {
      }
    }
    return null;
  };

  useEffect(() => {
    const checkQRCodeData = async () => {
      if (!qrResult) return;
      const urlFound = await checkIps(qrResult);
      if (urlFound) {
        setUrl(urlFound);
        if (onUrlFound && scannedEventId.current !== null) {
          onUrlFound(urlFound, scannedEventId.current);
        }
        setQrResult(null);
      }
    };
    checkQRCodeData();
  }, [qrResult, setUrl, onUrlFound]);

  const handleScanAgain = () => {
    setUrl("");
    setQrResult(null);
  };

  return {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
    url,
    checkIps,
    resetQrResult: () => setQrResult(null),
  };
};