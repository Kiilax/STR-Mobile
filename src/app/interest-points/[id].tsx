import { InterestPoint, Equipment } from "@/src/types"
import { Text, View, Image, ScrollView, useWindowDimensions, StyleSheet } from "react-native"
import { colors } from "@/src/constants/theme"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import Carousel from "react-native-reanimated-carousel"
import { fetchEquipmentById, fetchInterestPointById } from "@/src/api/"
import { API_URL } from "@/src/config"

export default function InterestPointDetailsScreen({ route }: { route: any }) {
  const { id } = useLocalSearchParams()
  const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(null)
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const { width } = useWindowDimensions()

  useEffect(() => {
    async function loadInterestPoint() {
      const point = await fetchInterestPointById(Number(id))
      setInterestPoint(point)
      if (point && point.equipmentPlacements.length > 0) {
        const equipmentIds = point.equipmentPlacements.map((ep) => ep.equipmentId)
        for (const equipId of equipmentIds) {
          const equipment = await fetchEquipmentById(equipId)
          if (equipment) {
            setEquipments((prev) => [...prev, equipment])
          }
        }
      }
    }
    loadInterestPoint()
  }, [id])

  if (!interestPoint) {
    return (
      <View style={styles.container}>
        <Text style={styles.comment}>{API_URL}</Text>
      </View>
    )
  }

  const images = [
    require("./placeholder.png"),
    require("./placeholder.png"),
    require("./placeholder.png"),
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.comment}>{interestPoint.comment}</Text>
        </View>

        {images && images.length > 0 && (
          <View style={styles.section}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Images</Text>
              <View style={styles.imagesContainer}>
                <Carousel
                  width={width - 40}
                  height={250}
                  data={images}
                  loop
                  autoPlay={true}
                  autoPlayInterval={5000}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image source={item} style={styles.image} resizeMode="cover" />
                    </View>
                  )}
                />
                <View style={styles.carouselIndicator}>
                  <Text style={styles.indicatorText}>Glissez pour naviguer entre les images</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {equipments.length > 0 && (
          <View style={styles.section}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Équipements associés</Text>
              <View style={styles.equipmentsContainer}>
                {equipments.map((equipment, index) => (
                  <View
                    key={equipment.id}
                    style={[
                      styles.equipmentItem,
                      index === equipments.length - 1 && styles.lastEquipmentItem,
                    ]}
                  >
                    <View style={styles.equipmentHeader}>
                      <Text style={styles.equipmentName}>{equipment.name}</Text>
                    </View>
                    <Text style={styles.equipmentDescription}>{equipment.description}</Text>
                    <Text style={styles.equipmentDimensions}>
                      Dimensions: {equipment.length} x {equipment.width} x {equipment.height}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  content: {
    padding: 20,
  },
  header: {
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
  title: {
    color: colors.dark.inverted,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  comment: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 16,
    lineHeight: 22,
  },
  imagesContainer: {
    marginTop: 16,
  },
  imageContainer: {
    borderRadius: 4,
    overflow: "hidden",
    width: "85%",
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: colors.dark.secondary,
  },
  section: {
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
  sectionTitle: {
    color: colors.dark.inverted,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    color: colors.dark.inverted,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  carouselIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  indicatorText: {
    color: colors.dark.inverted,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic",
  },
  equipmentsContainer: {
    marginTop: 8,
  },
  equipmentItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.accent,
    marginBottom: 8,
  },
  lastEquipmentItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  equipmentHeader: {
    marginBottom: 4,
  },
  equipmentName: {
    color: colors.dark.inverted,
    fontSize: 16,
    fontWeight: "600",
  },
  equipmentDescription: {
    color: colors.dark.inverted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    opacity: 0.9,
  },
  equipmentDimensions: {
    color: colors.dark.inverted,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: "italic",
  },
})
