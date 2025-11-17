import { useState } from "react"
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

interface UseImageSelectorProps {
  selectedImages: string[]
  onImagesChange: (images: string[]) => void
}

export function useImageSelector({ selectedImages, onImagesChange }: UseImageSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à la galerie est nécessaire pour sélectionner des images."
      )
      return false
    }
    return true
  }

  const pickImage = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    setIsLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      })

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri)
        const updatedImages = [...selectedImages, ...newImages]
        onImagesChange(updatedImages)
      }
    } catch {
      Alert.alert("Erreur", "Impossible de sélectionner les images.")
    } finally {
      setIsLoading(false)
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à l'appareil photo est nécessaire pour prendre des photos."
      )
      return
    }

    setIsLoading(true)
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
      })

      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri
        const updatedImages = [...selectedImages, newImage]
        onImagesChange(updatedImages)
      }
    } catch {
      Alert.alert("Erreur", "Impossible de prendre la photo.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  return {
    isLoading,
    pickImage,
    takePhoto,
    removeImage,
  }
}
