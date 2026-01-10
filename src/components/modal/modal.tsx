import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { colors } from "@/constants/theme";

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  fullScreen?: boolean;
  overlayOpacity?: number;
}

export default function ModalWrapper({
  visible,
  onClose,
  children,
  fullScreen = false,
  overlayOpacity = 0.5,
}: ModalWrapperProps) {
  if (fullScreen) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        {children}
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <Pressable
        style={[
          styles.overlay,
          { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
        ]}
        onPress={onClose}
      >
        <Pressable
          style={styles.content}
          onPress={(e: GestureResponderEvent) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: colors.dark.background,
  },
});
