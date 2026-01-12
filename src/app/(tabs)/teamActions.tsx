import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import {
  useTeamActionsStore,
  LocalTeamAction,
} from "@/hooks/useTeamActionsStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { styles } from "@/modules/team-actions/styles/TeamActionsScreen.styles";
import { useEventIdStore } from "@/hooks";
import { colors } from "@/constants/theme";

export default function TeamActionsScreen() {
  const router = useRouter();
  const [loadingActions, setLoadingActions] = useState(false);
  
  const { eventId } = useEventIdStore();

  const { equipments } = useEquipmentsStore();
  const { eventData } = useEventDataStore();

  const {
    teamActions,
    setTeamActionsFromApi,
    toggleActionDone,
    currentTeamId,
  } = useTeamActionsStore();

  const apiTeamId = currentTeamId ? parseInt(currentTeamId, 10) : 0;
  const {
    fetchTeamActions,
    error: apiError,
  } = useTeamActionsApi(apiTeamId, eventId ? eventId : 0);

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
  }, [currentTeamId, eventId, fetchTeamActions, setTeamActionsFromApi]);

  useEffect(() => {
    if (apiError) Alert.alert("Erreur API", apiError);
  }, [apiError]);

  const handleRescanPress = () => {
    router.push("/(tabs)/synchronization");
  };

  const getEquipmentName = (placementId: string | number) => {
    if (!eventData?.equipmentPlacements || !equipments) return "Chargement...";

    const placement = eventData.equipmentPlacements.find(
      (p) => p.id === Number(placementId)
    );

    if (!placement) {
      return `Placement #${placementId} introuvable`;
    }

    const equipment = equipments.find((e) => e.id === placement.equipmentId);
    return equipment ? equipment.name : "Équipement inconnu";
  };

  if (!eventId)
    return (
      <View style={styles.centerContent}>
        <Text style={styles.infoText}>
          Aucun événement sélectionné. Veuillez sélectionner un événement pour
          continuer.
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
            Vous devez d'abord synchroniser l'appareil pour récupérer le planning de votre équipe.
          </Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.push("/(tabs)/synchronization")}
          >
            <Text style={styles.mainButtonText}>Aller à la synchronisation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  const renderActionItem = ({ item }: { item: LocalTeamAction }) => {
    const isDropoff = item.action === "DROPOFF";
    const iconColor = isDropoff ? "#4CAF50" : "#F44336";

    const placementId =
      item.equipmentPlacementId || (item as any).equipmentPlacementId;
    const equipmentName = getEquipmentName(placementId);

    return (
      <TouchableOpacity
        style={[styles.actionCard, item.done && styles.actionCardDone]}
        onPress={() => toggleActionDone(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.actionContentSide}>
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
              style={[
                styles.actionTitle,
                item.done && styles.strikethroughText,
              ]}
            >
              {isDropoff ? "Déposer" : "Retirer"} : {equipmentName}
            </Text>
            <Text
              style={[
                styles.actionSubtitle,
                item.done && styles.strikethroughText,
              ]}
            >
              Emplacement n°{placementId}
            </Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <Ionicons
            name={item.done ? "checkmark-circle" : "ellipse-outline"}
            size={28}
            color={
              item.done
                ? colors.dark.tint || "#2196F3"
                : "rgba(255,255,255,0.3)"
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (!eventId) return null;

  return (
    <SafeAreaView style={styles.container}>
      {!currentTeamId ? (
        <View style={styles.centerContent}>
          <Ionicons
            name="sync-outline"
            size={100}
            color={colors.dark.text}
            style={{ opacity: 0.5, marginBottom: 30 }}
          />
          <Text style={styles.infoText}>
            Vous devez d'abord synchroniser l'appareil pour récupérer le planning de votre équipe.
          </Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.push("/(tabs)/synchronization")}
          >
            <Text style={styles.mainButtonText}>Aller à la synchronisation</Text>
          </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.mainButton, styles.rescanButton]}
              onPress={handleRescanPress}
              disabled={loadingActions}
            >
              <Ionicons name="refresh-outline" size={24} color="#FFF" />
              <Text style={styles.mainButtonText}>
                Changer de planning
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
