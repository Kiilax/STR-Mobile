import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { styles } from "./equipment-actions.styles";
import { EquipmentPlacement } from "@/types";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useEquipmentsStore } from "@/hooks";

interface EquipmentActionsProps {
  placement?: EquipmentPlacement | null;
  onClose?: () => void;
}

export default function EquipmentActions({
  placement,
  onClose,
}: EquipmentActionsProps) {
  const { toggleEquipmentVisited } = useEventDataStore();
  const { equipments } = useEquipmentsStore();

  if (!placement) return null;

  const handleOpenMaps = async () => {
    const { latitude, longitude } = placement.coordinates;

    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${latLng}&dirflg=d`,
      android: `google.navigation:q=${latLng}`,
    });

    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
          await Linking.openURL(browserUrl);
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert(
          "Erreur",
          "Impossible d'ouvrir l'application de navigation."
        );
      }
    }
  };

  const handleToggleVisited = async () => {
    await toggleEquipmentVisited(placement.id);
    if (onClose) onClose();
  };

  const equipment = equipments.find((e) => e.id === placement.equipmentId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {equipment?.name || "Équipement inconnu"}
        </Text>
        <Text style={styles.subtitle}>Quantité: {placement.quantity}</Text>
        <Text style={styles.subtitle}>{equipment?.description || ""}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.buttonMain}
          onPress={handleOpenMaps}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="navigate-circle" size={28} color="white" />
          </View>
          <Text style={styles.buttonTextMain}>Lancer l&apos;itinéraire</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="rgba(255,255,255,0.7)"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            placement.isVisited
              ? styles.buttonVisited
              : styles.buttonNotVisited,
          ]}
          onPress={handleToggleVisited}
          activeOpacity={0.8}
        >
          <Ionicons
            name={placement.isVisited ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={placement.isVisited ? "white" : colors.dark.text}
          />
          <Text
            style={[
              styles.buttonTextSecondary,
              placement.isVisited && styles.textVisited,
            ]}
          >
            {placement.isVisited
              ? "Marqué comme visité"
              : "Marquer comme visité"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
