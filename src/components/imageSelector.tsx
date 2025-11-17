import React from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/src/constants/theme"
import { useImageSelector } from "@/src/hooks"

interface ImageSelectorProps {
  selectedImages: string[]
  onImagesChange: (images: string[]) => void
  error?: string
}

export default function ImageSelector({
  selectedImages,
  onImagesChange,
  error,
}: ImageSelectorProps) {
  const { isLoading, pickImage, takePhoto, removeImage } = useImageSelector({
    selectedImages,
    onImagesChange,
  })

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Images</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Ionicons name="images" size={20} color="white" />
          <Text style={styles.buttonText}>Galerie</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={takePhoto}
          disabled={isLoading}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>Appareil photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>
            {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} sélectionnée
            {selectedImages.length > 1 ? "s" : ""}
          </Text>
          <ScrollView
            horizontal
            style={styles.imagesPreview}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContent}
          >
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                  <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedImages.length === 0 && (
        <Text style={styles.emptyText}>Aucune image sélectionnée</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.text,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.dark.tint,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: colors.dark.accent,
    marginBottom: 8,
  },
  imagesPreview: {
    flexGrow: 0,
    padding: 10,
    backgroundColor: colors.dark.secondary,
    borderRadius: 8,
  },
  imagesContent: {
    paddingRight: 8,
  },
  imageContainer: {
    position: "relative",
    marginRight: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.dark.secondary,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    color: colors.dark.accent,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
})
