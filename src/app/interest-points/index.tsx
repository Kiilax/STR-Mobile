import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native"
import { colors } from "@/src/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { InterestPointForm } from "@/src/components"
import ModalWrapper from "@/src/components/ui/modal"
import { useReactiveAsyncStore } from "@/src/hooks"
import { InterestPoint } from "@/src/types"
import { keys } from "@/src/config"
import { ImageStorage } from "@/src/utils"
import SearchBar from "@components/searchBar"

export default function InterestPointListScreen() {
  const [showPOIForm, setShowPOIForm] = useState(false)

  const { value, setValue, loading, error, clearError, refresh } = useReactiveAsyncStore<
    InterestPoint[]
  >(keys.interestPoints, [])
  const [filteredPoints, setFilteredPoints] = useState(value);

  useEffect(() => {
    setFilteredPoints(value);
  }, [value]);

  function addInterestPoint(point: InterestPoint) {
    console.log("Adding interest point:", point)
    setValue((prev) => [...prev, point])
    setFilteredPoints((prev) => [...prev, point])
  }
  function deleteInterestPoint(id: number) {
    const interestPoint = value.find((poi) => poi.id === id)
    for (const uri of interestPoint?.images || []) {
      ImageStorage.remove(uri)
    }
    setValue((prev) => prev.filter((poi) => poi.id !== id))
    setFilteredPoints((prev) => prev.filter((poi) => poi.id !== id))
  }

  if (error) {
    Alert.alert("Erreur de chargement", error.message, [
      { text: "Réessayer", onPress: refresh },
      { text: "Ignorer", onPress: clearError, style: "cancel" },
    ])
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.dark.tint} />
          <Text style={styles.loadingText}>Chargement des points d&apos;intérêt...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <SearchBar data={value} onFilter={setFilteredPoints} />
          </View>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            {!filteredPoints || filteredPoints.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucun point d'intérêt trouvé</Text>
              </View>
            ) : (
              filteredPoints.map((poi) => (
                <View key={poi.id} style={styles.item}>
                  {poi.images[0] && <Image source={{ uri: poi.images[0] }} style={styles.icon} />}
                  <Text style={styles.text}>{poi.comment}</Text>

                  <Pressable onPress={() => deleteInterestPoint(poi.id)} style={styles.deleteButton}>
                    <Ionicons name="trash" size={24} color={"#b14"} />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
      
      <TouchableOpacity style={styles.fab} onPress={() => setShowPOIForm(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>

      <ModalWrapper visible={showPOIForm} onClose={() => setShowPOIForm(false)} fullScreen={true}>
        <InterestPointForm onClose={() => setShowPOIForm(false)} onSubmit={addInterestPoint} />
      </ModalWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  deleteButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: colors.dark.inverted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    textAlign: "center",
    color: colors.dark.inverted,
    fontSize: 16,
    opacity: 0.7,
  },
})