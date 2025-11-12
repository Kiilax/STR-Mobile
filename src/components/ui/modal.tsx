import { ReactNode } from "react";
import { GestureResponderEvent, Modal, Pressable, StyleSheet } from "react-native";

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({
  visible,
  onClose,
  children,
}: ModalWrapperProps) {
  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}>
      <Pressable
        style={styles.overlay}
        onPress={onClose}>
        <Pressable
          style={styles.content}
          onPress={(e: GestureResponderEvent) => e.stopPropagation()}>
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
})