import { useRef, useState, useEffect } from "react";
import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { Alert } from "react-native";

interface UseQrCodeProps {
  onUrlFound?: (url: string, eventId: number, teamId: string | null) => void | Promise<void>;
}

export const useQrCode = ({ onUrlFound }: UseQrCodeProps = {}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { url, setUrl } = useUrlStore();
  const { setEventId } = useEventIdStore();

  const [qrIps, setQrIps] = useState<string[]>([]);
  const scannedEventId = useRef<number | null>(null);
  const scannedTeamId = useRef<string | null>(null);

  const fetchWithTimeout = (url: string, options: any = {}, timeout = 3000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return Promise.race([
      fetch(url, { ...options, signal: controller.signal }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      ),
    ]).finally(() => clearTimeout(timeoutId));
  };

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleQRScanResult = (data: string) => {
    try {
      const parsedData = JSON.parse(data) as QRCodeContent;

      if (!parsedData.eventId || !parsedData.ips) {
        Alert.alert("Erreur", "QR Code invalide: eventId ou ips manquant");
        return;
      }

      const eventId = Number(parsedData.eventId);
      
      if (isNaN(eventId)) {
        Alert.alert("Erreur", "QR Code invalide: ID d'événement incorrect");
        return;
      }


      scannedEventId.current = eventId;
      setEventId(eventId);
      
      if ('teamId' in parsedData && parsedData.teamId) {
        scannedTeamId.current = parsedData.teamId;
      } else {
        scannedTeamId.current = null;
      }

      if (Array.isArray(parsedData.ips)) {
        setQrIps(parsedData.ips);
        setShowQRScanner(false);
      } else {
        Alert.alert("Erreur", "Format des IPs incorrect (tableau attendu)");
      }
      
    } catch (error) {
      console.error("Erreur parsing QR:", error);
      Alert.alert("Erreur", "QR Code invalide: format JSON incorrect");
    }
  };

  const checkIps = async (ips: string[]): Promise<string | null> => {
    if (!ips || ips.length === 0) return null;
    
    for (const ip of ips) {
      try {
        let formattedIp = ip.trim();
        if (!formattedIp.startsWith('http://') && !formattedIp.startsWith('https://')) {
          formattedIp = `http://${formattedIp}`;
        }
        
        const response = (await fetchWithTimeout(
          formattedIp,
          { method: "GET", headers: { 'Accept': 'application/json' } },
          3000
        )) as Response;
        
        if (response.ok) {
          return formattedIp;
        }
      } catch (err) {
        // Continue to next IP
      }
    }
    return null;
  };

  useEffect(() => {
    const checkQRCodeData = async () => {
      if (qrIps.length === 0) return;
      
      const urlFound = await checkIps(qrIps);
      
      if (urlFound) {
        setUrl(urlFound);
        if (onUrlFound && scannedEventId.current) {
          await onUrlFound(urlFound, scannedEventId.current, scannedTeamId.current);
        }
        setQrIps([]); 
      } else {
        Alert.alert("Erreur connexion", "Aucune adresse IP du QR Code n'est joignable.");
        setQrIps([]);
      }
    };
    
    checkQRCodeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrIps, setUrl, onUrlFound]);

  const handleScanAgain = () => {
    setUrl("");
    setQrIps([]);
    scannedTeamId.current = null;
    scannedEventId.current = null;
  };

  return {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
    url,
    checkIps, 
    resetQrResult: () => setQrIps([]),
  };
};