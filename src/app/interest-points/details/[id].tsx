import { InterestPoint } from "@/src/types";
import { Text, View, Image, ScrollView, useWindowDimensions } from "react-native";
import { styles } from "./[id].styles";
import { useLocalSearchParams } from "expo-router";
import { fetchInterestPointById } from "@/src/api/interest-points";
import { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { Equipment } from "@/src/types/equipment";
import { fetchEquipmentById } from "@/src/api/equipments";

export default function InterestPointDetailsScreen({ route }: { route: any }) {
    const { id } = useLocalSearchParams();
    const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(null);
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const { width } = useWindowDimensions();

    useEffect(() => {
        async function loadInterestPoint() {
            const point = await fetchInterestPointById(id);
            setInterestPoint(point);
            if (point && point.equipmentPlacements.length > 0) {
                const equipmentIds = point.equipmentPlacements.map(ep => ep.equipmentId);
                for (const equipId of equipmentIds) {
                    const equipment = await fetchEquipmentById(equipId);
                    if (equipment) {
                        setEquipments(prev => [...prev, equipment]);
                    }
                }
            }
        }
        loadInterestPoint();
    }, [id]);

    if (!interestPoint) {
        return (
            <View style={styles.container}>
                <Text style={styles.comment}>Point d'intérêt non trouvé.</Text>
            </View>
        );
    }

    const images = [
        require("./placeholder.png"),
        require("./placeholder.png"),
        require("./placeholder.png")
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.comment}>{interestPoint.comment}</Text>
                </View>

                {images && images.length > 0 && (
                    <View style={styles.section}>
                        <View style={{flex: 1}}>
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
                                            <Image
                                                source={item}
                                                style={styles.image}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    )}
                                />
                                <View style={styles.carouselIndicator}>
                                    <Text style={styles.indicatorText}>
                                        Glissez pour naviguer entre les images
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {equipments.length > 0 && (
                    <View style={styles.section}>
                        <View style={{flex: 1}}>
                            <Text style={styles.sectionTitle}>Équipements associés</Text>
                            <View style={styles.equipmentsContainer}>
                                {equipments.map((equipment, index) => (
                                    <View key={equipment.id} style={[
                                        styles.equipmentItem,
                                        index === equipments.length - 1 && styles.lastEquipmentItem
                                    ]}>
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
    );
}