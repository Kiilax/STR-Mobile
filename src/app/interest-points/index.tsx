import React, { useEffect, useState } from "react"
import { Text, ScrollView, Image, TouchableOpacity } from "react-native"
import { styles } from "./index.styles"
import { useRouter } from "expo-router"
import { fetchInterestPoints } from "@/src/api/interest-points"
import { InterestPoint } from "@/src/types"

const placeholderImg = require("./details/placeholder.png")

export default function InterestPointListScreen() {
  const router = useRouter();

  const [interestPoints, setInterestPoints] = useState<InterestPoint[]>([]);

  useEffect(() => {
    async function loadInterestPoints() {
      const points = await fetchInterestPoints();
      setInterestPoints(points);
    }
    loadInterestPoints();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {interestPoints.map((eq) => (
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
