import { useRef, useState, useEffect } from "react";
import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";

interface UseQrCodeProps {
  onUrlFound?: (url: string, eventId: number) => void | Promise<void>;
}

export const useQrCode = ({ onUrlFound }: UseQrCodeProps = {}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { url, setUrl } = useUrlStore();
  const { setEventId } = useEventIdStore();
  const [qrResult, setQrResult] = useState<string | null>(null);
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
    // Check if data is valid format (e.g. "123;192.168.1.1")
    if (!data.includes(";")) return;

    const eventIdStr = data.split(";")[0];
    const eventId = Number(eventIdStr);

    if (isNaN(eventId)) return;

    scannedEventId.current = eventId;
    setEventId(eventId);
    const ips = data.substring(eventIdStr.length + 1);

    setQrResult(ips);
    setShowQRScanner(false);
  };

  const checkIps = async (ipsString: string): Promise<string | null> => {
    if (!ipsString || ipsString.trim() === "") return null;
    const ips = ipsString.split(";");
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      } catch (err) {}
    }
    return null;
  };

  useEffect(() => {
    const checkQRCodeData = async () => {
      if (!qrResult) return;
      const urlFound = await checkIps(qrResult);
      if (urlFound) {
        setUrl(urlFound);
        if (onUrlFound && scannedEventId.current) {
          onUrlFound(urlFound, scannedEventId.current);
        }
        setQrResult(null);
      }
    };
    checkQRCodeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
