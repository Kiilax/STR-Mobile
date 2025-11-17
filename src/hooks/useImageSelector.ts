import { useState } from "react"
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { useImageStorage } from "./useImageStorage"

interface UseImageSelectorProps {
  selectedImages: string[]
  onImagesChange: (images: string[]) => void
}

export function useImageSelector({ selectedImages, onImagesChange }: UseImageSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { save, remove } = useImageStorage()

  /**
   * Permet de sélectionner ou prendre des images et de les sauvegarder localement.
   * Fournit les fonctions pour gérer la sélection, la prise et la suppression d'images.
   * @returns {Object} - { isLoading, pickImage, takePhoto, removeImage }
   */
  async function requestMediaPermission() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la galerie est nécessaire.")
      return false
    }
    return true
  }

  async function requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission requise", "L'accès à la caméra est nécessaire.")
      return false
    }
    return true
  }

  async function pickImage() {
    const allowed = await requestMediaPermission()
    if (!allowed) return

    setIsLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      })

      if (!result.canceled) {
        const savedUris: string[] = []
        for (const asset of result.assets) {
          const savedUri = await save(asset.uri)
          if (savedUri) savedUris.push(savedUri)
          else {
            Alert.alert("Erreur", "Impossible de sauvegarder une ou plusieurs images.")
            break
          }
        }
        onImagesChange([...selectedImages, ...savedUris])
      }
    } catch {
      Alert.alert("Erreur", "Impossible de sélectionner les images.")
    } finally {
      setIsLoading(false)
    }
  }

  async function takePhoto() {
    const allowed = await requestCameraPermission()
    if (!allowed) return

    setIsLoading(true)
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      })

      if (!result.canceled) {
        const uri = result.assets[0].uri
        const savedUri = await save(uri)
        if (!savedUri) {
          Alert.alert("Erreur", "Impossible de sauvegarder la photo.")
          return
        }
        onImagesChange([...selectedImages, savedUri])
      }
    } catch {
      Alert.alert("Erreur", "Impossible de prendre la photo.")
    } finally {
      setIsLoading(false)
    }
  }

  async function removeImage(index: number) {
    const uri = selectedImages[index]
    await remove(uri)
    const updated = selectedImages.filter((_, i) => i !== index)
    onImagesChange(updated)
  }

  return {
    isLoading,
    pickImage,
    takePhoto,
    removeImage,
  }
}
