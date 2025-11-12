import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type CreateNavProp = StackNavigationProp<RootStackParamList, 'CreateProject'>;

type StreetItem = {
  id_voie: number;
  libelle_voie: string;
};

export default function CreateProjectScreen() {
  const navigation = useNavigation<CreateNavProp>();

  const streetsData: any = require('../assets/streets_converted.json');

  const streetList: StreetItem[] = useMemo(() => {
    const out: StreetItem[] = [];
    if (!streetsData || !Array.isArray(streetsData.results)) return out;
    for (const r of streetsData.results) {
      out.push({ id_voie: r.id_voie, libelle_voie: r.libelle_voie });
    }
    return out;
  }, [streetsData]);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  function toggleId(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function save() {
    if (!name || !date) {
      Alert.alert('Erreur', "Le nom et la date sont requis.");
      return;
    }
    const project = {
      id: `${Date.now()}`,
      name,
      date,
      description,
      streetIds: selectedIds,
    };

    // For now: navigate to ProjectMap with project object
    navigation.navigate('ProjectMap', { project } as any);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom du projet" />

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Description (facultatif)</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Description" multiline />

      <Text style={[styles.label, { marginTop: 12 }]}>Sélectionner des rues (extrait)</Text>
      <FlatList
        data={streetList.slice(0, 200)}
        keyExtractor={(s) => `${s.id_voie}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleId(item.id_voie)} style={styles.streetItem}>
            <Text style={{ flex: 1 }}>{item.libelle_voie}</Text>
            <Text>{selectedIds.includes(item.id_voie) ? '✓' : ''}</Text>
          </TouchableOpacity>
        )}
        style={{ maxHeight: 300 }}
      />

      <Button title="Enregistrer le projet" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  streetItem: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' },
});
