import React, { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/theme"
import { InterestPoint } from "@/types/interestPoint"
import CoordinateSelector from "./components/coordinate-selector"
import ImageSelector from "./components/image-selector"
import { Coordinates } from "@/types"
import { convertToAddress } from "@/utils"

interface InterestPointFormProps {
  onClose?: () => void
  onSubmit?: (data: InterestPoint) => void
}

interface InterestPointFormData {
  comment: string
  coordinates: Coordinates
  images: string[]
}

export default function InterestPointForm({ onClose, onSubmit }: InterestPointFormProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageError, setImageError] = useState<string | undefined>()

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
  })
  const coordinates = watch("coordinates")

  const handleCoordinatesChange = (coords: Coordinates) => {
    setValue("coordinates", coords)
  }

  const handleImagesChange = (images: string[]) => {
    setSelectedImages(images)
    setValue("images", images)
    if (images.length > 0) {
      setImageError(undefined)
    }
  }

  const onFormSubmit = async (data: InterestPointFormData) => {
    if (!data.images || data.images.length === 0) {
      setImageError("Veuillez ajouter au moins une image.")
      return
    }

    const poiData: InterestPoint = {
      id: Date.now(),
      comment: data.comment,
      coordinates: data.coordinates,
      images: data.images,
      synced: false,
      updated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVisited: false,
      address: (await convertToAddress(data.coordinates)) ?? "Adresse inconnue",
      equipmentPlacements: [],
    }
    onSubmit?.(poiData)
    onClose?.()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nouveau Point d&apos;Intérêt</Text>
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
                placeholder="Décrivez ce point d'intérêt..."
                placeholderTextColor={colors.dark.accent}
                multiline
                numberOfLines={3}
              />
            )}
          />
          {errors.comment && <Text style={styles.errorText}>{errors.comment.message}</Text>}
        </View>

        {/* Minimap */}
        <CoordinateSelector
          coordinates={coordinates}
          onCoordinatesChange={handleCoordinatesChange}
          error={errors.coordinates ? "Les coordonnées sont obligatoires" : undefined}
        />

        {/* Images */}
        <ImageSelector
          selectedImages={selectedImages}
          onImagesChange={handleImagesChange}
          error={imageError}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit(onFormSubmit)}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Création..." : "Créer le Point d'Intérêt"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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
    paddingTop: 60,
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
  submitButton: {
    backgroundColor: colors.dark.tint,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
})
