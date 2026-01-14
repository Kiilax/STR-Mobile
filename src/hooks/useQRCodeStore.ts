import { create } from "zustand";
import { useUrlStore } from "@/hooks/useUrlStore";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import type { QRCodeContent } from "@/types/qrCodeContent";

interface QRCodeState {
  showScanner: boolean;
  isScanning: boolean;
  error: string | null;
  scannedEventId: number | null;
  scannedTeamId: string | null;
  ipsToCheck: string[];

  setShowScanner: (show: boolean) => void;
  reset: () => void;
  processScanResult: (data: QRCodeContent) => Promise<boolean>;
}

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

const checkIps = async (ips: string[]): Promise<string | null> => {
  if (!ips || ips.length === 0) return null;

  for (const ip of ips) {
    try {
      let formattedIp = ip.trim();
      if (
        !formattedIp.startsWith("http://") &&
        !formattedIp.startsWith("https://")
      ) {
        formattedIp = `http://${formattedIp}`;
      }

      const response = (await fetchWithTimeout(
        formattedIp,
        { method: "GET", headers: { Accept: "application/json" } },
        3000
      )) as Response;

      if (response.ok) {
        return formattedIp;
      }
    } catch (err) {
      console.warn(`IP non joignable: ${ip}`, err);
    }
  }
  return null;
};

const useQRCodeStore = create<QRCodeState>((set, get) => ({
  showScanner: false,
  isScanning: false,
  error: null,
  scannedEventId: null,
  scannedTeamId: null,
  ipsToCheck: [],

  setShowScanner: (show) => set({ showScanner: show, error: null }),

  reset: () =>
    set({
      showScanner: false,
      isScanning: false,
      error: null,
      scannedEventId: null,
      scannedTeamId: null,
      ipsToCheck: [],
    }),

  processScanResult: async (data: QRCodeContent) => {
    if (get().isScanning) return false;
    set({ isScanning: true, error: null, showScanner: false });

    try {
      if (!data.eventId || !data.ips) {
        throw new Error("QR Code invalide: eventId ou ips manquant");
      }

      const eventId = Number(data.eventId);
      if (isNaN(eventId)) {
        throw new Error("QR Code invalide: ID d'événement incorrect");
      }

      const ips = Array.isArray(data.ips) ? data.ips : [data.ips];

      set({
        scannedEventId: eventId,
        scannedTeamId: "teamId" in data ? data.teamId : null,
        ipsToCheck: ips,
      });

      const { setEventId } = useEventIdStore.getState();
      const { setCurrentTeamId } = useTeamActionsStore.getState();

      await setEventId(eventId);
      if ("teamId" in data && data.teamId) {
        await setCurrentTeamId(data.teamId);
      }

      const urlFound = await checkIps(ips);

      if (urlFound) {
        const { setUrl } = useUrlStore.getState();
        await setUrl(urlFound);
        set({ isScanning: false });
        // showScanner is already false from start of function
        return true;
      } else {
        throw new Error("Aucune adresse IP du QR Code n'est joignable.");
      }
    } catch (error: any) {
      set({
        error: error.message || "Erreur inconnue",
        isScanning: false,
      });
      return false;
    }
  },
}));

export default useQRCodeStore;
