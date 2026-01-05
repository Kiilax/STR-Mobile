import { ModalWrapper, QRCodeScanner } from "@/components";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import { colors } from "@/constants/theme";
import { useQrCode, useSynchronization } from "@/modules/synchronization/hooks";

export default function EventScanner() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { eventId, eventIdLoading } = useEventIdStore();
  const hasNavigated = useRef(false);
  const router = useRouter();
  const { handleReceiveEvent } = useSynchronization();

  const onUrlFound = async (foundUrl: string, foundEventId: number) => {
    if (hasNavigated.current) return;

    console.log("Valid URL found via callback, receiving event...", foundUrl);
    hasNavigated.current = true;

    await handleReceiveEvent(foundUrl, foundEventId);

    router.navigate("/(tabs)");
  };

  const { handleQRScanResult } = useQrCode({ onUrlFound });

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleScanResult = (data: string) => {
    handleQRScanResult(data);
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowQRScanner(true)}
        >
          <Text style={styles.buttonText}>Scanner le QR Code</Text>
        </TouchableOpacity>
      )}
      {!eventId && (
        <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
          <QRCodeScanner title="Synchroniser" onScanResult={handleScanResult} />
        </ModalWrapper>
      )}
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
  button: {
    backgroundColor: colors.dark.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: colors.dark.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
