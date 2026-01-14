import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./error-modal.styles";

export type AlertType = "error" | "success" | "warning" | "info";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "primary" | "secondary" | "danger";
}

interface ErrorModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  buttons?: AlertButton[];
  onClose: () => void;
}

const iconConfig: Record<
  AlertType,
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  error: { name: "close-circle", color: "#F44336" },
  success: { name: "checkmark-circle", color: "#4CAF50" },
  warning: { name: "warning", color: "#FFC107" },
  info: { name: "information-circle", color: "#2196F3" },
};

const iconContainerStyle: Record<AlertType, object> = {
  error: styles.iconContainerError,
  success: styles.iconContainerSuccess,
  warning: styles.iconContainerWarning,
  info: styles.iconContainerInfo,
};

export default function ErrorModal({
  visible,
  title,
  message,
  type = "error",
  buttons,
  onClose,
}: ErrorModalProps) {
  const icon = iconConfig[type];
  const defaultButtons: AlertButton[] = buttons || [
    { text: "OK", onPress: onClose, style: "primary" },
  ];

  const getButtonStyle = (style?: "primary" | "secondary" | "danger") => {
    switch (style) {
      case "secondary":
        return styles.buttonSecondary;
      case "danger":
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };

  const getButtonTextStyle = (style?: "primary" | "secondary" | "danger") => {
    if (style === "secondary") {
      return [styles.buttonText, styles.buttonTextSecondary];
    }
    return styles.buttonText;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.iconContainer, iconContainerStyle[type]]}>
            <Ionicons name={icon.name} size={36} color={icon.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            {defaultButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, getButtonStyle(button.style)]}
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
