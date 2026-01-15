import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";
import { useImageSelector } from "../hooks";
import { Button } from "@/components";

interface ImageSelectorProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
  error?: string;
}

export default function ImageSelector({
  selectedImages,
  onImagesChange,
  error,
}: ImageSelectorProps) {
  const { isLoading, pickImage, takePhoto, removeImage } = useImageSelector({
    selectedImages,
    onImagesChange,
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Images</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Galerie"
          icon={<Ionicons name="images" size={20} color="white" />}
          onPress={pickImage}
          disabled={isLoading}
          style={{ flex: 1 }}
          variant="outline"
        />

        <Button
          title="Appareil photo"
          icon={<Ionicons name="camera" size={20} color="white" />}
          onPress={takePhoto}
          disabled={isLoading}
          style={{ flex: 1 }}
          variant="outline"
        />
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>
            {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""}{" "}
            sélectionnée
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
                <Button
                  onPress={() => removeImage(index)}
                  icon={<Ionicons name="close" size={14} color="white" />}
                  variant="danger"
                  iconOnly
                  activeOpacity={0.7}
                  style={styles.removeButton}
                />
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
  );
}

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.dark.text || "#FFFFFF",
    fontSize: typography.h4.fontSize,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  previewContainer: {
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: colors.dark.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  imagesPreview: {
    flexGrow: 0,
    backgroundColor: "transparent",
  },
  imagesContent: {
    paddingRight: 8,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#F44336",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  emptyText: {
    fontSize: 12,
    color: colors.dark.text,
    opacity: 0.5,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  errorText: {
    color: "#F44336",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
});
