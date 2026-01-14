import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/theme";
import { ModalWrapper, ErrorModal, Button } from "@/components";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useAlertModal } from "@/hooks";
import InterestPointForm from "@/modules/interest-point-form";

export default function InterestPointsScreen() {
  const {
    interestPoints,
    interestPointsLoading: interestPointsLoading,
    addInterestPoint,
    deleteInterestPoint,
  } = useInterestPointsStore();
  const router = useRouter();
  const [showPOIForm, setShowPOIForm] = useState(false);
  const { alertState, showError, hideAlert } = useAlertModal();

  return (
    <View style={styles.container}>
      {interestPointsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.dark.tint} />
          <Text style={styles.loadingText}>
            Chargement des points à sécuriser...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {interestPoints.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucun point à sécuriser disponible.
            </Text>
          ) : (
            interestPoints.map((poi) => (
              <Pressable
                key={poi.id}
                onPress={() => router.push(`/(tabs)/interest-points/${poi.id}`)}
              >
                <View style={styles.item}>
                  {poi.images[0] && (
                    <Image
                      source={{ uri: poi.images[0] }}
                      style={styles.icon}
                    />
                  )}
                  <Text style={styles.text}>{poi.comment}</Text>

                  <Pressable onPress={() => deleteInterestPoint(poi.id)}>
                    <Ionicons name="trash" size={24} color={"#b14"} />
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
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
          onError={showError}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.dark.background,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    backgroundColor: colors.dark.secondary,
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: colors.dark.inverted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.accent,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  text: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 16,
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    bottom: 95,
    right: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  loadingText: {
    marginTop: 10,
    color: colors.dark.inverted,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: colors.dark.inverted,
    fontSize: 16,
  },
});
