import { InterestPoint } from "@/src/types";
import { Text, View, Image, ScrollView, useWindowDimensions } from "react-native";
import { styles } from "./[id].styles";
import { useLocalSearchParams } from "expo-router";
import { fetchInterestPointById } from "@/src/api/interest-points";
import { useEffect, useState } from "react";
import Carousel from "react-native-reanimated-carousel";

export default function InterestPointDetailsScreen({ route }: { route: any }) {
    const { id } = useLocalSearchParams();
    const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(null);
    const { width } = useWindowDimensions();

    useEffect(() => {
        async function loadInterestPoint() {
            const point = await fetchInterestPointById(id);
            setInterestPoint(point);
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
                
                <View style={styles.section}>
                    <Text style={styles.infoText}>
                        Point d'intérêt #{interestPoint.id}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}