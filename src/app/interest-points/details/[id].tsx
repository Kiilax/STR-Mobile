import { InterestPoint } from "@/src/types";
import { Text, View, Image, ScrollView } from "react-native";
import { styles } from "./[id].styles";
import { INTEREST_POINTS_MOCK } from "../data/interest-points.mock";
import { useLocalSearchParams } from "expo-router";

export default function InterestPointDetailsScreen({ route }: { route: any }) {
    const { id } = useLocalSearchParams();
    const interestPoint = INTEREST_POINTS_MOCK.find((p) => p.id.toString() === id);

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
                                    source={{ uri: uri }} 
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