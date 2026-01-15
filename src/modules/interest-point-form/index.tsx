import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";
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
          <Button
            onPress={onClose}
            icon={<Ionicons name="close" size={24} color={colors.dark.text} />}
            variant="ghost"
            iconOnly
            size="sm"
          />
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Comment Section as Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Commentaire</Text>
          </View>
          <Controller
            control={control}
            name="comment"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                placeholder="Décrivez ce point à sécuriser..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={3}
              />
            )}
          />
          {errors.comment && (
            <Text style={styles.errorText}>{errors.comment.message}</Text>
          )}
        </View>

        {/* Minimap (Self-contained Card) */}
        <CoordinateSelector
          coordinates={coordinates}
          onCoordinatesChange={handleCoordinatesChange}
          error={
            errors.coordinates ? "Les coordonnées sont obligatoires" : undefined
          }
        />

        {/* Images (Self-contained Card) */}
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
          style={{ marginTop: 8, marginBottom: 40 }}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background || "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: colors.dark.background,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    color: colors.dark.text,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.dark.secondary || "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: typography.h4.fontSize,
    fontWeight: "600",
    color: colors.dark.text || "#FFFFFF",
  },
  textInput: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 8,
    padding: 12,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    textAlignVertical: "top",
    minHeight: 100,
    fontSize: 16,
  },
  errorText: {
    color: "#F44336",
    fontSize: 13,
    marginTop: 8,
  },
});
