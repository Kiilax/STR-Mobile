import React, { useState } from "react"
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native"
import INTEREST_POINTS_MOCK from "@/src/data/interest-points.mock"
import { colors } from "@/src/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { POIForm } from "@/src/components"
import ModalWrapper from "@/src/components/ui/modal"
const placeholderImg = require("@/src/data/placeholder.jpg")

export default function InterestPointListScreen() {
  const [showPOIForm, setShowPOIForm] = useState(false)

  return (
    <View style={styles.container}>
      {/* POI List */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 80 }}>
        {INTEREST_POINTS_MOCK.map((eq) => (
          <View key={eq.id} style={styles.item}>
            <Image source={placeholderImg} style={styles.icon} />
            <Text style={styles.text}>{eq.comment}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Show POI Form */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowPOIForm(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>
      <ModalWrapper visible={showPOIForm} onClose={() => setShowPOIForm(false)} fullScreen={true}>
        <POIForm
          onClose={() => setShowPOIForm(false)}
          onSubmit={(data) => {
            console.log("Nouveau POI créé:", data)
            // TODO: @Nizar - Ajouter la logique pour sauvegarder le nouveau POI
          }}
        />
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    bottom: 110,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: colors.dark.tint,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 40,
    right: 20,
    width: 55,
    height: 55,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
})
