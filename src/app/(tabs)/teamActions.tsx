import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import {
  useTeamActionsStore,
  LocalTeamAction,
} from "@/hooks/useTeamActionsStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { styles } from "@/modules/team-actions/styles/TeamActionsScreen.styles";
import { useEventIdStore, useAlertModal } from "@/hooks";
import { colors } from "@/constants/theme";
import { useEquipmentPlacementStore } from "@/hooks/useEquipementPlacmentStore";
import { EquipmentStatus } from "@/types";
import { ErrorModal, Button } from "@/components";

export default function TeamActionsScreen() {
  const router = useRouter();
  const [loadingActions, setLoadingActions] = useState(false);
  const { alertState, showError, hideAlert } = useAlertModal();

  const { eventId } = useEventIdStore();
  const { equipments } = useEquipmentsStore();

  const { teamActions, setTeamActionsFromApi, currentTeamId } =
    useTeamActionsStore();

  const { equipmentPlacements, getEquipmentPlacementById, setEquipmentStatus } =
    useEquipmentPlacementStore();

  const apiTeamId = currentTeamId ? parseInt(currentTeamId, 10) : 0;
  const { fetchTeamActions, error: apiError } = useTeamActionsApi(
    apiTeamId,
    eventId ? eventId : 0
  );

  useEffect(() => {
    const loadTeamActions = async () => {
      if (!currentTeamId || !eventId) return;

      try {
        setLoadingActions(true);
        const response = await fetchTeamActions();
        if (response) {
          await setTeamActionsFromApi(response);
        }
      } catch (error) {
        console.error("Erreur fetch actions:", error);
      } finally {
        setLoadingActions(false);
      }
    };

    loadTeamActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeamId, eventId]);

  useEffect(() => {
    if (apiError) showError("Erreur API", apiError);
  }, [apiError, showError]);

  const handleRescanPress = () => {
    router.push("/(tabs)/synchronization");
  };

  const handleNavigateToEquipment = (placementId: string | number) => {
    const placement = getEquipmentPlacementById(Number(placementId));

    if (
      placement &&
      placement.coordinates &&
      placement.coordinates.length > 0
    ) {
      const { latitude, longitude } = placement.coordinates[0];
      router.push({
        pathname: "/(tabs)",
        params: {
          focusPlacementId: placement.id,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });
    }
  };

  const getEquipmentName = (placementId: string | number) => {
    if (!equipmentPlacements || !equipments) return "Chargement...";

    const placement = equipmentPlacements.find(
      (p) => p.id === Number(placementId)
    );

    if (!placement) {
      return `Placement #${placementId} introuvable`;
    }

    const equipment = equipments.find((e) => e.id === placement.equipmentId);
    return equipment ? equipment.name : "Équipement inconnu";
  };

  const isActionDone = (item: LocalTeamAction) => {
    const placementId =
      item.equipmentPlacementId || (item as any).equipmentPlacementId;
    const placement = getEquipmentPlacementById(Number(placementId));

    if (!placement) return false;

    if (item.action === "DROPOFF") {
      return (
        placement.status === EquipmentStatus.DROPPED_OFF ||
        placement.status === EquipmentStatus.REMOVED
      );
    }

    if (item.action === "REMOVE") {
      return placement.status === EquipmentStatus.REMOVED;
    }

    return false;
  };

  const handleToggleAction = async (item: LocalTeamAction) => {
    const placementId =
      item.equipmentPlacementId || (item as any).equipmentPlacementId;
    const placement = getEquipmentPlacementById(Number(placementId));

    if (!placement) return;

    if (item.action === "DROPOFF") {
      if (placement.status === EquipmentStatus.DROPPED_OFF) {
        await setEquipmentStatus(placement.id, EquipmentStatus.PENDING);
      } else {
        await setEquipmentStatus(placement.id, EquipmentStatus.DROPPED_OFF);
      }
    } else if (item.action === "REMOVE") {
      if (placement.status === EquipmentStatus.REMOVED) {
        await setEquipmentStatus(placement.id, EquipmentStatus.DROPPED_OFF);
      } else {
        await setEquipmentStatus(placement.id, EquipmentStatus.REMOVED);
      }
    }
  };

  if (!eventId)
    return (
      <View style={styles.centerContent}>
        <Text style={styles.infoText}>
            Pour récupérer le planning de votre équipe, veuillez d&apos;abord
            générer et scanner le QR Code &quot;Planning&quot;.
        </Text>
      </View>
    );

  if (!currentTeamId)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons
            name="sync-outline"
            size={100}
            color={colors.dark.text}
            style={{ opacity: 0.5, marginBottom: 30 }}
          />
          <Text style={styles.infoText}>
            Pour récupérer le planning de votre équipe, veuillez d&apos;abord
            générer et scanner le QR Code &quot;Planning&quot;.
          </Text>
          <Button
            title="Aller à la synchronisation"
            onPress={() => router.push("/(tabs)/synchronization")}
            size="lg"
            fullWidth
          />
        </View>
      </SafeAreaView>
    );

  const renderActionItem = ({ item }: { item: LocalTeamAction }) => {
    const isDropoff = item.action === "DROPOFF";
    const iconColor = isDropoff ? "#4CAF50" : "#F44336";
    const done = isActionDone(item);

    const placementId =
      item.equipmentPlacementId || (item as any).equipmentPlacementId;
    const equipmentName = getEquipmentName(placementId);

    return (
      <View style={[styles.actionCard, done && styles.actionCardDone]}>
        <TouchableOpacity
          style={styles.actionContentSide}
          onPress={() => handleNavigateToEquipment(placementId)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.actionIconContainer,
              isDropoff ? styles.dropoffIcon : styles.removeIcon,
            ]}
          >
            <Ionicons
              name={isDropoff ? "cube-outline" : "trash-outline"}
              size={22}
              color={iconColor}
            />
          </View>

          <View style={styles.actionTexts}>
            <Text
              style={[styles.actionTitle, done && styles.strikethroughText]}
            >
              {isDropoff ? "Poser" : "Retirer"} : {equipmentName}
            </Text>
            <Text
              style={[styles.actionSubtitle, done && styles.strikethroughText]}
            >
              Emplacement n°{placementId}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleToggleAction(item)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={done ? "checkmark-circle" : "ellipse-outline"}
            size={28}
            color={
              done ? colors.dark.tint || "#2196F3" : "rgba(255,255,255,0.3)"
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (!eventId) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {!currentTeamId ? (
        <View style={styles.centerContent}>
          <Ionicons
            name="sync-outline"
            size={100}
            color={colors.dark.text}
            style={{ opacity: 0.5, marginBottom: 30 }}
          />
          <Text style={styles.infoText}>
            Vous devez d&apos;abord synchroniser l&apos;appareil pour récupérer
            le planning de votre équipe.
          </Text>
          <Button
            title="Aller à la synchronisation"
            onPress={() => router.push("/(tabs)/synchronization")}
            size="lg"
            fullWidth
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.dashboardContainer}>
            <View style={styles.simpleHeader}>
              <Text style={styles.teamTitleLarge}>Équipe {currentTeamId}</Text>
            </View>

            <View style={styles.listContainer}>
              {loadingActions ? (
                <View style={styles.centerContent}>
                  <ActivityIndicator size="large" color={colors.dark.tint} />
                </View>
              ) : (
                <FlatList
                  data={teamActions}
                  renderItem={renderActionItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.actionsListContent}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text style={[styles.infoText, { marginTop: 40 }]}>
                      Aucune action prévue.
                    </Text>
                  }
                />
              )}
            </View>
          </View>

          <View style={styles.footerContainer}>
            <Button
              title="Changer de planning"
              variant="secondary"
              size="md"
              icon={<Ionicons name="refresh-outline" size={20} color="#FFF" />}
              onPress={handleRescanPress}
              disabled={loadingActions}
              fullWidth
            />
          </View>
        </View>
      )}

      <ErrorModal
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        buttons={alertState.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}
