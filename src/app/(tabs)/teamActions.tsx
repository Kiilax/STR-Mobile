import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQrCode } from "@/hooks/useQRCode";
import { ModalWrapper, QRCodeScanner } from "@/components";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import {
  useTeamActionsStore,
  LocalTeamAction,
} from "@/hooks/useTeamActionsStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { useEventDataStore } from "@/hooks/useEventDataStore";
import { styles } from "@/modules/team-actions/styles/TeamActionsScreen.styles";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { useEventIdStore } from "@/hooks";
import { colors } from "@/constants/theme";

export default function TeamActionsScreen() {
  const [hasScannedQR, setHasScannedQR] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);

  const { eventId } = useEventIdStore();

  const { equipments } = useEquipmentsStore();
  const { eventData } = useEventDataStore();

  const {
    teamActions,
    setTeamActionsFromApi,
    toggleActionDone,
    resetTeamActions,
  } = useTeamActionsStore();

  const apiTeamId = currentTeamId ? parseInt(currentTeamId, 10) : 0;
  const {
    fetchTeamActions,
    loading: loadingActions,
    error: apiError,
  } = useTeamActionsApi(apiTeamId, eventId ? eventId : 0);

  const {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
    url,
  } = useQrCode({
    onUrlFound: useCallback(
      async (
        foundUrl: string,
        foundEventId: number,
        foundTeamId: string | null
      ) => {
        if (foundTeamId) {
          setCurrentTeamId(foundTeamId);
          setHasScannedQR(true);
        } else {
          Alert.alert(
            "Erreur",
            "Identifiant d'équipe manquant dans le QR Code."
          );
          handleRescanPress();
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    ),
  });

  useEffect(() => {
    const loadAndInjectLocalState = async () => {
      if (!url || !currentTeamId || !hasScannedQR) return;

      try {
        const response = await fetchTeamActions();
        if (response) {
          await setTeamActionsFromApi(response);
        }
      } catch (error) {
        console.error("Erreur fetch actions:", error);
      }
    };

    loadAndInjectLocalState();
  }, [
    url,
    currentTeamId,
    hasScannedQR,
    fetchTeamActions,
    setTeamActionsFromApi,
  ]);

  useEffect(() => {
    if (apiError) Alert.alert("Erreur API", apiError);
  }, [apiError]);

  const handleScanResult = (parsedData: QRCodeContent | null) => {
    if (parsedData) handleQRScanResult(JSON.stringify(parsedData));
  };

  const handleRescanPress = () => {
    handleScanAgain();
    resetTeamActions();
    setHasScannedQR(false);
    setCurrentTeamId(null);
    setShowQRScanner(true);
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
      {!hasScannedQR ? (
        <View style={styles.centerContent}>
          <Ionicons
            name="qr-code-outline"
            size={100}
            color={colors.dark.text}
            style={{ opacity: 0.5, marginBottom: 30 }}
          />
          <Text style={styles.infoText}>
            Veuillez scanner le QR Code du planning pour commencer.
          </Text>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setShowQRScanner(true)}
          >
            <Text style={styles.mainButtonText}>Scanner le Planning</Text>
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
                Scanner un nouveau planning
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title="Scanner le QR Planning"
          onScanResult={handleScanResult}
        />
      </ModalWrapper>
    </SafeAreaView>
  );
}
