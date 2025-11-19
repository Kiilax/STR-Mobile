import { View, Text, Pressable } from 'react-native';
import { useQRStore } from '@/src/store/QRCode';
import { useReactiveAsyncStore } from '@/src/hooks';
import { keys } from '@/src/config';
import { createInterestPoint, fetchInterestPoints } from '@/src/api';
import { InterestPoint } from '@/src/types';


export default function QRCodeDataDisplay() {
    const qrData = useQRStore(state => state.qrData);
    const storage = useReactiveAsyncStore<InterestPoint[] | null>(keys.interestPoints, null);
    
    const handleSync = async () => {
        if (!storage.value) return null;
        const dataToSend = storage.value.map(({ coordinates, comment }) => ({ coordinates, comment }));
        createInterestPoint(dataToSend).then(() => {
            console.log(`Interest points synchronized successfully.`);
        }).catch((error) => {
            console.error(`Failed to synchronize interest points:`, error);
        });

        const interestPoints = await fetchInterestPoints();
        await storage.setValue(interestPoints.data);
    }

    return (
        <View>
            <Pressable onPress={handleSync}>
                <Text>Commencer la synchronisation</Text>
            </Pressable>
            <Text>Données du QR : {qrData}</Text>
        </View>
    );
};