import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSendInterestPoints } from "@/modules/synchronization/hooks/useSynchronization";
import { styles } from "./status-message.styles";

export default function StatusMessage() {
  const { status, message } = useSendInterestPoints();
  return (
    <View>
      {status !== "idle" && (
        <View
          style={[
            styles.statusContainer,
            status === "success" ? styles.successMessage : styles.errorMessage,
          ]}
        >
          <Ionicons
            name={status === "success" ? "checkmark-circle" : "alert-circle"}
            size={20}
            color="#FFFFFF"
          />
          <Text
            style={status === "success" ? styles.successText : styles.errorText}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}
