import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { InterestPoint, Coordinates } from "@/types";
import { useEventIdStore } from "@/hooks/useEventIdStore";
import CoordinateSelector from "./components/coordinate-selector";
import ImageSelector from "./components/image-selector";
import { convertToAddress } from "@/utils";
import { Button } from "@/components";

interface InterestPointFormProps {
  onClose?: () => void;
  onSubmit?: (data: InterestPoint) => void;
}

interface InterestPointFormData {
  comment: string;
  coordinates: Coordinates;
  images: string[];
}

export default function InterestPointForm({
  onClose,
  onSubmit,
}: InterestPointFormProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | undefined>();
  const { eventId, eventIdLoading } = useEventIdStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InterestPointFormData>({
    defaultValues: {
      comment: "",
      coordinates: { latitude: 0, longitude: 0 },
      images: [],
    },
  });
  const coordinates = watch("coordinates");

  const handleCoordinatesChange = (coords: Coordinates) => {
    setValue("coordinates", coords);
  };

  const handleImagesChange = (images: string[]) => {
    setSelectedImages(images);
    setValue("images", images);
    if (images.length > 0) {
      setImageError(undefined);
    }
  };

  const onFormSubmit = async (data: InterestPointFormData) => {
    if (!data.images || data.images.length === 0) {
      setImageError("Veuillez ajouter au moins une image.");
      return;
    }

    if (eventIdLoading) {
      return;
    }

    const poiData: InterestPoint = {
      id: Date.now(),
      coordinates: data.coordinates,
      address: (await convertToAddress(data.coordinates)) ?? "Adresse inconnue",
      comment: data.comment,
      images: data.images,
      isVisited: false,
      synced: false,
      updated: false,
      equipmentPlacements: [],
      eventId: eventId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onSubmit?.(poiData);
    onClose?.();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Nouveau point à sécuriser</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Comment */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Commentaire</Text>
          <Controller
            control={control}
            name="comment"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                placeholder="Décrivez ce point à sécuriser..."
                placeholderTextColor={colors.dark.accent}
                multiline
                numberOfLines={3}
              />
            )}
          />
          {errors.comment && (
            <Text style={styles.errorText}>{errors.comment.message}</Text>
          )}
        </View>

        {/* Minimap */}
        <CoordinateSelector
          coordinates={coordinates}
          onCoordinatesChange={handleCoordinatesChange}
          error={
            errors.coordinates ? "Les coordonnées sont obligatoires" : undefined
          }
        />

        {/* Images */}
        <ImageSelector
          selectedImages={selectedImages}
          onImagesChange={handleImagesChange}
          error={imageError}
        />

        {/* Submit Button */}
        <Button
          title={isSubmitting ? "Création..." : "Créer le point à sécuriser"}
          onPress={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
          fullWidth
          style={{ marginTop: 16, marginBottom: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 8,
    padding: 12,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.dark.accent,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
