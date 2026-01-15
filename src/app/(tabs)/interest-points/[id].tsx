import { InterestPoint } from "@/types";
import {
  Text,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ImageStorage } from "@/utils";
import { useInterestPointsStore } from "@/hooks/useInterestPointsStore";
import { useEquipmentsStore } from "@/hooks/useEquipmentsStore";
import { useAlertModal } from "@/hooks";
import { ErrorModal, Button } from "@/components";

export default function InterestPointDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { interestPoints, setInterestPoints } = useInterestPointsStore();
  const { equipments } = useEquipmentsStore();
  const { alertState, showError, showSuccess, showWarning, hideAlert } =
    useAlertModal();

  const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(
    null
  );
  const [selectedEquipments, setSelectedEquipments] = useState<any[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width } = useWindowDimensions();

  const selectedInterestPoint = interestPoints.find((item) => {
    return item.id === Number(id);
  });

  useEffect(() => {
    if (selectedInterestPoint) {
      setInterestPoint(selectedInterestPoint);
      setEditedComment(selectedInterestPoint.comment || "");
      setSelectedEquipments([]);
      for (const placement of selectedInterestPoint.equipmentPlacements || []) {
        for (const equipment of equipments) {
          if (equipment.id === placement.equipmentId) {
            setSelectedEquipments((prev) => [...prev, equipment]);
          }
        }
      }
    }
  }, [selectedInterestPoint, equipments]);

  if (!interestPoints) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.dark.tint} />
        <Text style={styles.loadingText}>
          Chargement du point à sécuriser...
        </Text>
      </View>
    );
  }

  if (!selectedInterestPoint) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle" size={48} color={colors.dark.accent} />
          <Text style={styles.errorText}>Point à sécuriser non trouvé</Text>
          <Button
            title="Retour"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!interestPoint) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={colors.dark.tint} />
        <Text style={styles.loadingText}>
          Chargement du point à sécuriser...
        </Text>
      </View>
    );
  }

  const updateInterestPoint = (updatedPoint: InterestPoint) => {
    updatedPoint.synced = false;
    updatedPoint.updated = true;
    const updatedPoints = interestPoints.map((point: InterestPoint) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
    setInterestPoints(updatedPoints);
    setInterestPoint(updatedPoint);
  };

  const handleEditComment = () => {
    if (!interestPoint) return;

    const updatedPoint = {
      ...interestPoint,
      comment: editedComment,
    };

    updateInterestPoint(updatedPoint);
    setEditModalVisible(false);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError(
          "Permission requise",
          "L'accès à la galerie est nécessaire pour sélectionner des images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && interestPoint && result.assets[0]) {
        const newImageUri = result.assets[0].uri;

        const storedUri = await ImageStorage.save(newImageUri);

        if (storedUri) {
          const updatedPoint = {
            ...interestPoint,
            images: [...interestPoint.images, storedUri].filter(
              (uri): uri is string => uri !== null
            ),
          };

          updateInterestPoint(updatedPoint);
          showSuccess("Succès", "Image ajoutée avec succès");
        } else {
          showError("Erreur", "Impossible de sauvegarder l'image");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showError("Erreur", "Impossible d'ajouter l'image");
    }
    setImagePickerModalVisible(false);
  };

  const deleteImage = (imageIndex: number) => {
    if (!interestPoint) return;

    showWarning(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette image ?",
      [
        { text: "Annuler", style: "secondary" },
        {
          text: "Supprimer",
          style: "danger",
          onPress: () => {
            const imageToDelete = interestPoint.images[imageIndex];
            ImageStorage.remove(imageToDelete);

            const updatedImages = interestPoint.images.filter(
              (_, index) => index !== imageIndex
            );
            const updatedPoint = {
              ...interestPoint,
              images: updatedImages,
            };

            updateInterestPoint(updatedPoint);
          },
        },
      ]
    );
  };

  const deleteInterestPoint = () => {
    if (!interestPoint) return;

    showWarning(
      "Supprimer le point à sécuriser",
      "Êtes-vous sûr de vouloir supprimer ce point à sécuriser ?",
      [
        { text: "Annuler", style: "secondary" },
        {
          text: "Supprimer",
          style: "danger",
          onPress: () => {
            interestPoint.images.forEach((uri) => {
              ImageStorage.remove(uri);
            });
            const updatedPoints = interestPoints.filter(
              (point) => point.id !== interestPoint.id
            );
            setInterestPoints(updatedPoints);
            setInterestPoint(null);

            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header avec boutons d'action */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={24}
                color={colors.dark.tint}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{interestPoint.address}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setEditModalVisible(true)}
              >
                <Ionicons name="pencil" size={20} color={colors.dark.tint} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={deleteInterestPoint}
              >
                <Ionicons name="trash-outline" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardContent}>
            <Text style={styles.label}>Commentaire</Text>
            <Text style={styles.commentText}>
              {interestPoint.comment || "Aucun commentaire"}
            </Text>
          </View>
        </View>

        {/* Section Images */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Images</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setImagePickerModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={colors.dark.tint} />
            </TouchableOpacity>
          </View>

          {interestPoint.images && interestPoint.images.length > 0 ? (
            <View style={styles.imagesWrapper}>
              <Carousel
                width={width - 64} // Padding: 20 (screen) + 12 (card) * 2 approx
                height={250}
                data={interestPoint.images.map((uri, index) => ({
                  uri,
                  index,
                }))}
                loop={interestPoint.images.length > 1}
                autoPlay={interestPoint.images.length > 1}
                autoPlayInterval={5000}
                onSnapToItem={(index) => setCurrentImageIndex(index)}
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.image}
                      resizeMode="cover"
                      onError={(e) =>
                        console.error(
                          "Error loading image:",
                          e.nativeEvent.error
                        )
                      }
                    />
                    <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={() => deleteImage(item.index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <View style={styles.carouselIndicator}>
                <Text style={styles.imageCounter}>
                  {currentImageIndex + 1} / {interestPoint.images.length}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>Aucune image</Text>
              <TouchableOpacity
                style={styles.dashedButton}
                onPress={() => setImagePickerModalVisible(true)}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.dark.tint}
                />
                <Text style={styles.dashedButtonText}>Ajouter une photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section Équipements */}
        {selectedEquipments.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Équipements associés</Text>
            </View>
            <View style={styles.equipmentsList}>
              {selectedEquipments.map((equipment, index) => (
                <View
                  key={equipment.id}
                  style={[
                    styles.equipmentItem,
                    index === selectedEquipments.length - 1 &&
                      styles.lastEquipmentItem,
                  ]}
                >
                  <Image
                    source={{ uri: equipment.image }}
                    style={styles.equipmentImage}
                  />
                  <View style={styles.equipmentInfo}>
                    <Text style={styles.equipmentName}>{equipment.name}</Text>
                    <Text style={styles.equipmentDesc}>
                      {equipment.description}
                    </Text>
                    <Text style={styles.equipmentDims}>
                      {equipment.length} x {equipment.width} x{" "}
                      {equipment.height}m
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bouton retour */}
        <Button
          title="Retour à la liste"
          onPress={() => router.back()}
          icon={<Ionicons name="arrow-back" size={20} color="white" />}
          variant="danger"
        />
      </ScrollView>

      {/* Modal d'édition du commentaire */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le commentaire</Text>
            <TextInput
              style={styles.commentInput}
              value={editedComment}
              onChangeText={setEditedComment}
              multiline
              numberOfLines={4}
              placeholder="Saisissez votre commentaire..."
              placeholderTextColor="#999"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEditComment}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal d'ajout d'images */}
      <Modal
        visible={imagePickerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une image</Text>
            <View style={styles.imagePickerOptions}>
              <TouchableOpacity
                style={styles.imagePickerOption}
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color={colors.dark.tint} />
                <Text style={styles.imagePickerOptionText}>
                  Choisir depuis la galerie
                </Text>
              </TouchableOpacity>
            </View>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setImagePickerModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.dark.background,
  },
  loadingText: {
    marginTop: 16,
    color: colors.dark.inverted,
    fontSize: typography.body.fontSize,
  },
  errorText: {
    marginTop: 16,
    color: colors.dark.inverted,
    fontSize: typography.h3.fontSize,
    textAlign: "center",
  },

  // CARD STYLES
  card: {
    backgroundColor: colors.dark.secondary || "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.h4.fontSize,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 12,
  },
  cardContent: {
    gap: 8,
  },

  // HEADER SPECIFIC
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  // TEXT STYLES
  label: {
    color: colors.dark.text,
    fontSize: 12,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  commentText: {
    color: colors.dark.inverted,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },

  // IMAGES
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  imagesWrapper: {
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: 250,
  },
  deleteImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  carouselIndicator: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  imageCounter: {
    color: colors.dark.inverted,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  emptyStateText: {
    color: colors.dark.inverted,
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 12,
  },
  dashedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "dashed",
    borderRadius: 8,
  },
  dashedButtonText: {
    color: colors.dark.text,
    fontSize: 14,
  },

  // EQUIPMENTS
  equipmentsList: {
    gap: 0,
  },
  equipmentItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  lastEquipmentItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  equipmentImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#333",
    marginRight: 12,
  },
  equipmentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  equipmentName: {
    color: colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  equipmentDesc: {
    color: colors.dark.inverted,
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  equipmentDims: {
    color: colors.dark.inverted,
    fontSize: 11,
    opacity: 0.5,
    fontStyle: "italic",
  },

  // COMMON BUTTONS
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  backButtonText: {
    color: colors.dark.text,
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  commentInput: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    color: colors.dark.inverted,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  saveButton: {
    backgroundColor: colors.dark.tint,
  },
  cancelButtonText: {
    color: colors.dark.inverted,
    fontSize: 14,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePickerOptions: {
    gap: 12,
    marginBottom: 24,
  },
  imagePickerOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  imagePickerOptionText: {
    color: colors.dark.inverted,
    fontSize: 16,
    fontWeight: "500",
  },
});
