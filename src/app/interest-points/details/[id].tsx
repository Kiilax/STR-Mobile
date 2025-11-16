import { InterestPoint } from "@/src/types";
import { Text, View, Image, ScrollView } from "react-native";
import { styles } from "./[id].styles";
import { useLocalSearchParams } from "expo-router";
import { fetchInterestPointById } from "@/src/api/interest-points";
import { useEffect, useState } from "react";

export default function InterestPointDetailsScreen({ route }: { route: any }) {
    const { id } = useLocalSearchParams();
    const [interestPoint, setInterestPoint] = useState<InterestPoint | null>(null);

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
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Détails du point d'intérêt</Text>
                    <Text style={styles.comment}>{interestPoint.comment}</Text>
                </View>
                
                {interestPoint.images && interestPoint.images.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Images</Text>
                        <View style={styles.imagesContainer}>
                            {interestPoint.images.map((imageUri, index) => (
                                <Image 
                                    key={index} 
                                    source={{ uri: imageUri }} 
                                    style={styles.image} 
                                />
                            ))}
                        </View>
                    </View>
                )}
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>
                    <Text style={styles.infoText}>
                        Point d'intérêt #{interestPoint.id}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}