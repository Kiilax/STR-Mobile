import { ScrollView, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import {
  StepCard,
  PointsInfo,
  StatusMessage,
  SyncCard,
  QRCodeCard,
} from "@/modules/synchronization/components";

export default function SynchronizationScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <StepCard />

      {/* Section QR Code */}
      <QRCodeCard />

      {/* Section Points à synchroniser */}
      <PointsInfo />

      {/* Section Synchronisation */}
      <SyncCard />

      {/* Status Message */}
      <StatusMessage />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
