import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, typography } from "@/constants/theme";
import { ModalWrapper, ErrorModal, Button } from "@/components";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useAlertModal } from "@/hooks";
import InterestPointForm from "@/modules/interest-point-form";
import { InterestPoint } from "@/types";

export default function InterestPointsScreen() {
  const {
    interestPoints,
    interestPointsLoading,
    addInterestPoint,
    deleteInterestPoint,
  } = useInterestPointsStore();
  const router = useRouter();
  const [showPOIForm, setShowPOIForm] = useState(false);
  const { alertState, hideAlert } = useAlertModal();

  const handleNavigateToPOI = (id: number) => {
    router.push(`/(tabs)/interest-points/${id}`);
  };

  const renderItem = ({ item }: { item: InterestPoint }) => {
    const hasImage = item.images && item.images.length > 0;

    return (
      <View style={styles.actionCard}>
        <TouchableOpacity
          style={styles.actionContentSide}
          onPress={() => handleNavigateToPOI(item.id)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.actionIconContainer,
              hasImage ? styles.imageContainer : styles.iconContainer,
            ]}
          >
            {hasImage ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.cardImage}
              />
            ) : (
              <Ionicons
                name="location-outline"
                size={22}
                color={colors.dark.tint}
              />
            )}
          </View>

          <View style={styles.actionTexts}>
            <Text style={styles.actionTitle} numberOfLines={1}>
              {item.address}
            </Text>
            <Text style={styles.actionSubtitle} numberOfLines={2}>
              {item.comment || "Aucun commentaire"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteActionContainer}
          onPress={() => deleteInterestPoint(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.dashboardContainer}>
        <View style={styles.listContainer}>
          {interestPointsLoading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.dark.tint} />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <FlatList
              data={interestPoints}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.centerContent}>
                  <Text style={styles.emptyText}>
                    Aucun point à sécuriser disponible.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>

      <Button
        icon={<Ionicons name="add" size={26} color="white" />}
        iconOnly
        size="lg"
        onPress={() => setShowPOIForm(true)}
        style={styles.fab}
      />

      <ModalWrapper
        visible={showPOIForm}
        onClose={() => setShowPOIForm(false)}
        fullScreen={true}
      >
        <InterestPointForm
          onClose={() => setShowPOIForm(false)}
          onSubmit={addInterestPoint}
        />
      </ModalWrapper>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background || "#121212",
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  simpleHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  titleLarge: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as "bold",
    lineHeight: typography.h1.lineHeight,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionCard: {
    backgroundColor: colors.dark.secondary || "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContentSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  iconContainer: {
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    borderWidth: 1,
    borderColor: colors.dark.tint,
    borderRadius: 21,
  },
  imageContainer: {
    backgroundColor: "transparent",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.body.fontSize,
    fontWeight: typography.label.fontWeight as "600",
    lineHeight: typography.body.lineHeight,
    marginBottom: 4,
  },
  actionSubtitle: {
    color: colors.dark.text || "#CCCCCC",
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    opacity: 0.7,
  },
  deleteActionContainer: {
    marginLeft: 10,
    padding: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 14,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loadingText: {
    marginTop: 10,
    color: colors.dark.inverted,
    fontSize: typography.body.fontSize,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.dark.inverted,
    fontSize: typography.body.fontSize,
  },
});
