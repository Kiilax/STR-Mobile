import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Project = {
  id: string;
  name: string;
  date: string;
  description?: string;
  streetIds: number[];
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const focused = useIsFocused();

  const [projects, setProjects] = useState<Project[]>([]);

  // For now keep projects in-memory. Could be replaced with AsyncStorage.
  useEffect(() => {
    // noop: placeholder for loading persisted projects
  }, [focused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projets</Text>
        <Button title="Créer un projet" onPress={() => navigation.navigate('CreateProject')} />
      </View>

      {projects.length === 0 ? (
        <View style={styles.empty}>
          <Text>Aucun projet enregistré.</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('ProjectMap', { project: item })}
            >
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSub}>{item.date} • {item.streetIds.length} rues</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '600' },
  empty: { padding: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSub: { fontSize: 12, color: 'gray' },
});
