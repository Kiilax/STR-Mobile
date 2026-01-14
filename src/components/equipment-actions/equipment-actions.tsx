import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import { styles } from "./equipment-actions.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useEquipmentsStore } from "@/hooks";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { EquipmentStatus } from "@/types";

interface EquipmentActionsProps {
  placementId: number;
  onClose?: () => void;
  onError?: (title: string, message: string) => void;
}

export default function EquipmentActions({
  placementId,
  onClose,
  onError,
}: EquipmentActionsProps) {
  const { equipmentPlacements, setEquipmentStatus } =
    useEquipmentPlacementStore();
  const { equipments } = useEquipmentsStore();

  const placement = equipmentPlacements.find((p) => p.id === placementId);

  if (!placement) return null;

  const handleOpenMaps = async () => {
    if (!placement.coordinates || placement.coordinates.length === 0) {
      onError?.("Erreur", "Aucune coordonnée disponible pour cet équipement.");
      return;
    }

    const { latitude, longitude } = placement.coordinates[0];

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
        onError?.("Erreur", "Impossible d'ouvrir l'application de navigation.");
      }
    }
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
            placement.status === EquipmentStatus.DROPPED_OFF
              ? styles.buttonVisited
              : styles.buttonNotVisited,
          ]}
          onPress={() => {
            if (placement.status === EquipmentStatus.DROPPED_OFF) {
              setEquipmentStatus(placement.id, EquipmentStatus.PENDING);
            } else {
              setEquipmentStatus(placement.id, EquipmentStatus.DROPPED_OFF);
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={
              placement.status === EquipmentStatus.DROPPED_OFF
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={24}
            color={
              placement.status === EquipmentStatus.DROPPED_OFF
                ? "white"
                : colors.dark.text
            }
          />
          <Text
            style={[
              styles.buttonTextSecondary,
              placement.status === EquipmentStatus.DROPPED_OFF &&
                styles.textVisited,
            ]}
          >
            {placement.status === EquipmentStatus.DROPPED_OFF
              ? "Equipement posé"
              : "Poser cet équipement"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            placement.status === EquipmentStatus.REMOVED
              ? styles.buttonVisited
              : styles.buttonNotVisited,
          ]}
          onPress={() => {
            if (placement.status === EquipmentStatus.REMOVED) {
              setEquipmentStatus(placement.id, EquipmentStatus.DROPPED_OFF);
            } else {
              setEquipmentStatus(placement.id, EquipmentStatus.REMOVED);
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={
              placement.status === EquipmentStatus.REMOVED
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={24}
            color={
              placement.status === EquipmentStatus.REMOVED
                ? "white"
                : colors.dark.text
            }
          />
          <Text
            style={[
              styles.buttonTextSecondary,
              placement.status === EquipmentStatus.REMOVED &&
                styles.textVisited,
            ]}
          >
            {placement.status === EquipmentStatus.REMOVED
              ? "Equipement retiré"
              : "Retirer cet équipement"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
