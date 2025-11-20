import React, { useState } from "react"
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
import { API_URL } from "@/src/config"
import { useMainContext } from "@/src/context/mainContext"
import { useRouter } from "expo-router"

export default function InterestPointListScreen() {
  const [showPOIForm, setShowPOIForm] = useState(false)
  const router = useRouter();
  const { interestPoints, addInterestPoint, deleteInterestPoint, error, loading, clearError, refreshInterestPoints } = useMainContext()

  if (error) {
    Alert.alert("Erreur de chargement", error.message, [
      { text: "Réessayer", onPress: refreshInterestPoints },
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
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 80 }}>
          {interestPoints.length === 0 ? (
            <Text style={styles.emptyText}>{API_URL}</Text>
          ) : (
            interestPoints.map((poi) => (
              <Pressable 
                key={poi.id}
                onPress={() => router.push(`/interest-points/${poi.id}`)}
              >
                <View style={styles.item}>
                  
                    {poi.images[0] && <Image source={{ uri: poi.images[0] }} style={styles.icon} />}
                    <Text style={styles.text}>{poi.comment}</Text>

                    <Pressable onPress={() => deleteInterestPoint(poi.id)}>
                      {/* button to delete */}
                      <Ionicons name="trash" size={24} color={"#b14"} />
                    </Pressable>
                  
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
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
    position: "relative",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.dark.background,
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
  fab: {
    position: "absolute",
    bottom: 95,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
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
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: colors.dark.inverted,
    fontSize: 16,
  },
})
