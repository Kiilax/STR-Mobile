import React from "react"
import { Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { INTEREST_POINTS_MOCK } from "./data/interest-points.mock"
import { styles } from "./index.styles"
import { useRouter } from "expo-router"

const placeholderImg = require("./data/placeholder.jpg")

export default function InterestPointListScreen() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {INTEREST_POINTS_MOCK.map((eq) => (
        <TouchableOpacity 
          key={eq.id} 
          style={styles.item}
          onPress={() => router.push(`/interest-points/details/${eq.id}`)}
        >
          <Image source={placeholderImg} style={styles.icon} />
          <Text style={styles.text}>{eq.comment}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}
