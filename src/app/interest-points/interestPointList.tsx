import React from "react"
import { View, Text, ScrollView, StyleSheet, Image } from "react-native"
import { INTEREST_POINTS_MOCK } from "../interest-points/data/interest-points.mock"
import { colors } from "@/src/constants/theme"
const placeholderImg = require("./data/placeholder.jpg")

export default function InterestPointListScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {INTEREST_POINTS_MOCK.map((eq) => (
        <View key={eq.id} style={styles.item}>
          <Image source={placeholderImg} style={styles.icon} />
          <Text style={styles.text}>{eq.comment}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
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
})
