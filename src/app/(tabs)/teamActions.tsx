import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQrCode } from "@/hooks/useQRCode";
import { ModalWrapper, QRCodeScanner } from "@/components";
import { TeamAction } from "@/types/teamAction";
import { useTeamActionsApi } from "@/modules/team-actions/hooks/useTeamActionsApi";
import { useTeamActionsStore } from "@/hooks/useTeamActionsStore";
import { styles } from "@/modules/team-actions/styles/TeamActionsScreen.styles";
import type { QRCodeContent } from "@/types/qrCodeContent";
import { useEventIdStore } from "@/hooks";

export default function TeamActionsScreen() {
  const [hasScannedQR, setHasScannedQR] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const { eventId } = useEventIdStore();
  if (!eventId) {
    console.error("Event ID is not set in the store.");
    return null;
  }
  const { teamActions, setTeamActions } = useTeamActionsStore();

  const apiTeamId = currentTeamId ? parseInt(currentTeamId, 10) : 0;
  const { fetchTeamActions, loading: loadingActions, error: apiError } = useTeamActionsApi(apiTeamId, eventId);

  const {
    showQRScanner,
    setShowQRScanner,
    handleCloseScanner,
    handleQRScanResult,
    handleScanAgain,
    url,
  } = useQrCode({
    onUrlFound: useCallback(async (foundUrl: string, foundEventId: number, foundTeamId: string | null) => {
      console.log("Connexion établie :", foundUrl);
      
      if (foundTeamId) {
        setCurrentTeamId(foundTeamId);
        setHasScannedQR(true);
      } else {
        Alert.alert("Attention", "Ce QR Code ne contient pas d'identifiant d'équipe.");
        setHasScannedQR(false);
      }
    }, []),
  });

  useEffect(() => {
    const loadTeamActions = async () => {
      if (!url || !currentTeamId || !hasScannedQR) return;
      
      try {
        console.log("Récupération des actions pour l'équipe:", currentTeamId);
        const response = await fetchTeamActions();
        
        if (response) {
          const teamActionsArray = Array.isArray(response) ? response : [response];
          await setTeamActions(teamActionsArray);
        }
      } catch (error) {
        console.error("Erreur fetch actions:", error);
      }
    };

    loadTeamActions();
  }, [url, currentTeamId, hasScannedQR, refreshCount, fetchTeamActions, setTeamActions]);

  useEffect(() => {
    if (apiError) {
      Alert.alert("Erreur de récupération", apiError);
    }
  }, [apiError]);

  const handleScan = (parsedData: QRCodeContent | null) => {
    if (!parsedData) return;

    handleQRScanResult(JSON.stringify(parsedData));
  };

  const handleRefreshActions = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleCompleteAction = (actionId: string) => {
    Alert.alert(
      "Terminer l'action",
      "Confirmer la réalisation de cette tâche ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Terminer",
          onPress: () => {
            const updatedActions = teamActions.filter(action => action.id !== actionId);
            setTeamActions(updatedActions);
          },
        },
      ]
    );
  };

  const onRescanPress = () => {
    handleScanAgain();
    setHasScannedQR(false);
    setCurrentTeamId(null);
    setTeamActions([]);
    setShowQRScanner(true);
  };

  const renderActionItem = ({ item }: { item: TeamAction }) => (
    <TouchableOpacity 
      style={styles.actionCard}
      onPress={() => handleCompleteAction(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.actionHeader}>
        <View style={[
          styles.actionIconContainer,
          item.action === "DROPOFF" ? styles.dropoffIcon : styles.removeIcon
        ]}>
          <Ionicons
            name={item.action === "DROPOFF" ? "cube-outline" : "trash-outline"}
            size={20}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>
            {item.action === "DROPOFF" ? "Déposer" : "Retirer"}
          </Text>
          <Text style={styles.actionSubtitle}>
            Emplacement : {item.equipementPlacementId}
          </Text>
        </View>
        <Ionicons name="ellipse-outline" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {!hasScannedQR ? (
          <View style={styles.centerContent}>
            <Ionicons name="qr-code-outline" size={80} color="#333" style={{ marginBottom: 24 }} />
            <Text style={styles.infoText}>
              Scannez le QR Code de votre feuille de route pour charger les actions.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowQRScanner(true)}
            >
              <Text style={styles.buttonText}>Scanner le Planning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.dashboardContainer}>
            {/* Header Equipe */}
            <View style={styles.teamHeader}>
              <View>
                <Text style={styles.teamTitle}>Équipe {currentTeamId}</Text>
              </View>
              <TouchableOpacity onPress={onRescanPress} style={{ padding: 8 }}>
                 <Ionicons name="qr-code" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Liste des actions */}
            <View style={styles.actionsContainer}>
              <View style={styles.actionsHeader}>
                <Text style={styles.actionsTitle}>To-Do List ({teamActions.length})</Text>
                <TouchableOpacity onPress={handleRefreshActions}>
                  <Ionicons name="refresh" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {loadingActions ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.loadingText}>Chargement...</Text>
                </View>
              ) : teamActions.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
                  <Text style={styles.emptyText}>Aucune action en attente</Text>
                </View>
              ) : (
                <FlatList
                  data={teamActions}
                  renderItem={renderActionItem}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  contentContainerStyle={styles.actionsList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        )}
      </View>

      <ModalWrapper visible={showQRScanner} onClose={handleCloseScanner}>
        <QRCodeScanner
          title="Scanner le QR Planning"
          onScanResult={handleScan}
        />
      </ModalWrapper>
    </View>
  );
}