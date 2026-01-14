import { Modal, View, Text, ActivityIndicator } from "react-native";
import { styles } from "./loading-modal.styles";
import { colors } from "@/constants/theme";

interface LoadingModalProps {
  visible: boolean;
  title?: string;
  message?: string;
}

export default function LoadingModal({
  visible,
  title = "Chargement",
  message,
}: LoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.dark.accent} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}
