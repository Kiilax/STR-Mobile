import { InterestPoint } from "@/types"
import {
  Text,
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from "react-native"
import { colors } from "@/constants/theme"
import { useLocalSearchParams, router, Stack } from "expo-router"
import { useEffect, useState } from "react"
import Carousel from "react-native-reanimated-carousel"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { ImageStorage } from "@/utils"
import { useMainContext } from "@/context/mainContext"

export default function InterestPointDetailsScreen() {
  const { id } = useLocalSearchParams()
  const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(null)
  const [selectedEquipments, setSelectedEquipments] = useState<any[]>([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editedComment, setEditedComment] = useState("")
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { width } = useWindowDimensions()
  const { interestPoints, setInterestPoints, equipments } = useMainContext()

  const selectedInterestPoint = interestPoints.find((item) => {
    return item.id === Number(id)
  })

  useEffect(() => {
    if (selectedInterestPoint) {
      setInterestPoint(selectedInterestPoint)
      setEditedComment(selectedInterestPoint.comment || "")
      setSelectedEquipments([])
      for (const placement of selectedInterestPoint.equipmentPlacements || []) {
        for (const equipment of equipments) {
          if (equipment.id === placement.equipmentId) {
            setSelectedEquipments((prev) => [...prev, equipment])
          }
        }
      }
    }
  }, [selectedInterestPoint, equipments])

  if (!interestPoints || interestPoints.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.dark.tint} />
        <Text style={styles.loadingText}>Chargement du point d&apos;intérêt...</Text>
      </View>
    )
  }

  if (!selectedInterestPoint) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.dark.accent} />
          <Text style={styles.errorText}>Point d&apos;intérêt non trouvé</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (!interestPoint) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.dark.tint} />
        <Text style={styles.loadingText}>Chargement du point d&apos;intérêt...</Text>
      </View>
    )
  }

  const updateInterestPoint = (updatedPoint: InterestPoint) => {
    updatedPoint.synced = false
    updatedPoint.updated = true
    const updatedPoints = interestPoints.map((point: InterestPoint) =>
      point.id === updatedPoint.id ? updatedPoint : point
    )
    setInterestPoints(updatedPoints)
    setInterestPoint(updatedPoint)
  }

  const handleEditComment = () => {
    if (!interestPoint) return

    const updatedPoint = {
      ...interestPoint,
      comment: editedComment,
    }

    updateInterestPoint(updatedPoint)
    setEditModalVisible(false)
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la galerie est nécessaire pour sélectionner des images."
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      })

      if (!result.canceled && interestPoint && result.assets[0]) {
        const newImageUri = result.assets[0].uri

        const storedUri = await ImageStorage.save(newImageUri)

        const updatedPoint = {
          ...interestPoint,
          images: [...interestPoint.images, storedUri].filter((uri): uri is string => uri !== null),
        }

        updateInterestPoint(updatedPoint)
        Alert.alert("Succès", "Image ajoutée avec succès")
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Erreur", "Impossible d'ajouter l'image")
    }
    setImagePickerModalVisible(false)
  }

  const deleteImage = (imageIndex: number) => {
    if (!interestPoint) return

    Alert.alert("Supprimer l'image", "Êtes-vous sûr de vouloir supprimer cette image ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          const imageToDelete = interestPoint.images[imageIndex]
          ImageStorage.remove(imageToDelete)

          const updatedImages = interestPoint.images.filter((_, index) => index !== imageIndex)
          const updatedPoint = {
            ...interestPoint,
            images: updatedImages,
          }

          updateInterestPoint(updatedPoint)
        },
      },
    ])
  }

  const deleteInterestPoint = () => {
    if (!interestPoint) return

    Alert.alert(
      "Supprimer le point d'intérêt",
      "Êtes-vous sûr de vouloir supprimer ce point d'intérêt ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            interestPoint.images.forEach((uri) => {
              ImageStorage.remove(uri)
            })
            const updatedPoints = interestPoints.filter((point) => point.id !== interestPoint.id)
            setInterestPoints(updatedPoints)
            setInterestPoint(null)

            router.back()
          },
        },
      ]
    )
  }
  console.log("Selected equipments:", selectedEquipments)

  return (
    <>
      <Stack.Screen options={{ title: "Détails du point d'intérêt" }} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header avec boutons d'action */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.comment}>{interestPoint.comment}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Ionicons name="pencil" size={20} color={colors.dark.tint} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={deleteInterestPoint}>
                  <Ionicons name="trash" size={20} color="#b14" />
                </TouchableOpacity>
              </View>
            </View>
            {interestPoint.address && (
              <View style={styles.addressContainer}>
                <Ionicons name="location" size={16} color={colors.dark.tint} />
                <Text style={styles.addressText}>{interestPoint.address}</Text>
              </View>
            )}
          </View>

          {/* Section Images */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Images</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setImagePickerModalVisible(true)}
              >
                <Ionicons name="add" size={20} color={colors.dark.tint} />
              </TouchableOpacity>
            </View>

            {interestPoint.images && interestPoint.images.length > 0 ? (
              <View style={styles.imagesContainer}>
                <Carousel
                  width={width - 40}
                  height={250}
                  data={interestPoint.images.map((uri, index) => ({ uri, index }))}
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
                        onError={(e) => console.log("Error loading image:", e.nativeEvent.error)}
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
                  <Text style={styles.indicatorText}>Glissez pour naviguer entre les images</Text>
                </View>
              </View>
            ) : (
              <View style={styles.noImagesContainer}>
                <Text style={styles.noImagesText}>Aucune image</Text>
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={() => setImagePickerModalVisible(true)}
                >
                  <Ionicons name="images" size={24} color={colors.dark.tint} />
                  <Text style={styles.addImageText}>Ajouter une image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {selectedEquipments.length > 0 && (
            <View style={styles.section}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Équipements associés</Text>
                <View style={styles.equipmentsContainer}>
                  {selectedEquipments.map((equipment, index) => (
                    <View
                      key={equipment.id}
                      style={[
                        styles.equipmentItem,
                        index === selectedEquipments.length - 1 && styles.lastEquipmentItem,
                      ]}
                    >
                      <Image source={{ uri: equipment.image }} style={styles.equipmentImage} />

                      <View style={styles.equipmentHeader}>
                        <Text style={styles.equipmentName}>{equipment.name}</Text>
                      </View>
                      <Text style={styles.equipmentDescription}>{equipment.description}</Text>
                      <Text style={styles.equipmentDimensions}>
                        Dimensions: {equipment.length} x {equipment.width} x {equipment.height}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

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
                <TouchableOpacity style={styles.imagePickerOption} onPress={pickImage}>
                  <Ionicons name="images" size={32} color={colors.dark.tint} />
                  <Text style={styles.imagePickerOptionText}>Choisir depuis la galerie</Text>
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
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: 20,
  },
  header: {
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
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  comment: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 16,
    lineHeight: 22,
    marginRight: 12,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dark.accent,
  },
  addressText: {
    color: colors.dark.inverted,
    fontSize: 13,
    opacity: 0.8,
    flex: 1,
  },
  section: {
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    padding: 4,
  },
  imagesContainer: {
    marginTop: 16,
  },
  imageContainer: {
    borderRadius: 4,
    overflow: "hidden",
    width: "85%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: colors.dark.secondary,
  },
  deleteImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
  noImagesContainer: {
    alignItems: "center",
    padding: 20,
  },
  noImagesText: {
    color: colors.dark.inverted,
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.dark.tint,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addImageText: {
    color: colors.dark.tint,
    fontSize: 16,
  },
  carouselIndicator: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
  imageCounter: {
    color: colors.dark.inverted,
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.9,
  },
  indicatorText: {
    color: colors.dark.inverted,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic",
  },
  equipmentsContainer: {
    marginTop: 8,
  },
  equipmentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    marginBottom: 8,
  },
  lastEquipmentItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  equipmentHeader: {
    marginBottom: 4,
  },
  equipmentName: {
    color: colors.dark.inverted,
    fontSize: 16,
    fontWeight: "600",
  },
  equipmentDescription: {
    color: colors.dark.inverted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    opacity: 0.9,
  },
  equipmentDimensions: {
    color: colors.dark.inverted,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic",
  },
  equipmentImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  commentInput: {
    backgroundColor: colors.dark.background,
    borderWidth: 1,
    borderColor: colors.dark.accent,
    borderRadius: 8,
    padding: 12,
    color: colors.dark.inverted,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.dark.accent,
  },
  saveButton: {
    backgroundColor: colors.dark.tint,
  },
  cancelButtonText: {
    color: colors.dark.inverted,
    fontSize: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePickerOptions: {
    gap: 16,
    marginBottom: 20,
  },
  imagePickerOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: colors.dark.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.accent,
  },
  imagePickerOptionText: {
    color: colors.dark.inverted,
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    color: colors.dark.inverted,
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: colors.dark.inverted,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.dark.tint,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
