import { ModalWrapper, QRCodeScanner } from "@/components";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useMainContext } from "@/context/mainContext";
import useQRCodeStore from "@/hooks/useQRCodeStore";
import { colors } from "@/constants/theme";

export default function EventScanner() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { eventId, eventIdLoading } = useMainContext();
  const hasNavigated = useRef(false);
  const router = useRouter();
  const { setEventId } = useMainContext();

  const handleCloseScanner = () => {
    setShowQRScanner(false);
  };

  const handleScanResult = (data: string) => {
    if (hasNavigated.current) return;

    hasNavigated.current = true;
    const eventId = data.split(";")[0];
    const ips = data.substring(eventId.length + 1);

    setEventId(Number(eventId));
    useQRCodeStore.getState().setResult(ips);
    router.navigate("/(tabs)");
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
      <ActivityIndicator size="large" color={colors.dark.tint} />
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
});
