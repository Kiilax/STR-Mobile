import React, { useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Polygon, Polyline, Marker, Region } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export default function MapScreen() {
  // By default do not show all streets. If navigated from CreateProject/ProjectMap
  // a `project` param is provided and those streets will be drawn.
  const SHOW_STREETS = false;
  const route = useRoute<RouteProp<RootStackParamList, 'ProjectMap'>>();
  const project = route?.params?.project;
  // charge le GeoJSON local (assets/ à la racine du projet)
  const geojson: any = require('../assets/bas_rhin.json');
  const streetsData: any = require('../assets/streets_converted.json');

  const coordFromPair = (pair: number[]) => ({ latitude: pair[1], longitude: pair[0] });

  const shapes = useMemo(() => {
    const out: { type: string; coords: any }[] = [];
    if (!geojson || !geojson.features) return out;

    for (const feat of geojson.features) {
      const geom = feat.geometry;
      if (!geom) continue;
      const t = geom.type;
      if (t === 'Polygon') {
        const ring = geom.coordinates[0].map(coordFromPair);
        out.push({ type: 'Polygon', coords: ring });
      } else if (t === 'MultiPolygon') {
        for (const polygon of geom.coordinates) {
          const ring = polygon[0].map(coordFromPair);
          out.push({ type: 'Polygon', coords: ring });
        }
      } else if (t === 'LineString') {
        const line = geom.coordinates.map(coordFromPair);
        out.push({ type: 'Polyline', coords: line });
      } else if (t === 'Point') {
        out.push({ type: 'Point', coords: coordFromPair(geom.coordinates) });
      }
    }
    return out;
  }, [geojson]);

  const fullStreetShapes = useMemo(() => {
    const out: { id?: number; label?: string; type: string; coords: any }[] = [];
    if (!streetsData || !Array.isArray(streetsData.results)) return out;
    for (const item of streetsData.results) {
      const geom = item?.geo_shape?.geometry;
      if (!geom) continue;
      const t = geom.type;
      const label = item.libelle_voie;
      const id = item.id_voie;
      if (t === 'LineString') {
        out.push({ id, label, type: 'Polyline', coords: geom.coordinates.map(coordFromPair) });
      } else if (t === 'MultiLineString') {
        for (const line of geom.coordinates) {
          out.push({ id, label, type: 'Polyline', coords: line.map(coordFromPair) });
        }
      }
    }
    return out;
  }, [streetsData]);

  const CHUNK_SIZE = 200;
  const CHUNK_DELAY_MS = 120;
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    SHOW_STREETS ? Math.min(CHUNK_SIZE, fullStreetShapes.length) : 0
  );
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    // Only enable incremental loading when streets are shown
    if (!SHOW_STREETS) return undefined;

    setVisibleCount(Math.min(CHUNK_SIZE, fullStreetShapes.length));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fullStreetShapes.length <= CHUNK_SIZE) return undefined;

    let current = Math.min(CHUNK_SIZE, fullStreetShapes.length);
    intervalRef.current = setInterval(() => {
      current = Math.min(fullStreetShapes.length, current + CHUNK_SIZE);
      setVisibleCount(current);
      if (current >= fullStreetShapes.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, CHUNK_DELAY_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullStreetShapes]);

  const visibleStreetShapes = useMemo(() => {
    if (project && Array.isArray(project.streetIds)) {
      // Filter full list to only those ids selected in the project
      return fullStreetShapes.filter((s) => s.id && project.streetIds.includes(s.id));
    }
    return SHOW_STREETS ? fullStreetShapes.slice(0, visibleCount) : [];
  }, [fullStreetShapes, visibleCount, project]);

  const initialRegion: Region = useMemo(() => {
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    const allShapes = [...shapes, ...(visibleStreetShapes || [])];
    for (const s of allShapes) {
      const pts = s.type === 'Point' ? [s.coords] : s.coords;
      for (const p of pts) {
        minLat = Math.min(minLat, p.latitude);
        maxLat = Math.max(maxLat, p.latitude);
        minLng = Math.min(minLng, p.longitude);
        maxLng = Math.max(maxLng, p.longitude);
      }
    }
    if (minLat > maxLat) {
      return { latitude: 48.5734, longitude: 7.7521, latitudeDelta: 0.5, longitudeDelta: 0.5 };
    }
    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;
    const latitudeDelta = Math.max(0.02, (maxLat - minLat) * 1.5);
    const longitudeDelta = Math.max(0.02, (maxLng - minLng) * 1.5);
    return { latitude, longitude, latitudeDelta, longitudeDelta };
  }, [shapes, fullStreetShapes]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {shapes.map((s, i) => {
          if (s.type === 'Polygon') {
            return <Polygon key={`poly-${i}`} coordinates={s.coords} strokeColor="#3366FF" fillColor="rgba(51,102,255,0.2)" strokeWidth={2} />;
          }
          if (s.type === 'Polyline') {
            return <Polyline key={`line-${i}`} coordinates={s.coords} strokeColor="#FF6633" strokeWidth={3} />;
          }
          if (s.type === 'Point') {
            return <Marker key={`pt-${i}`} coordinate={s.coords} />;
          }
          return null;
        })}

        {visibleStreetShapes.map((s: { type: string; coords: any }, i: number) => {
          if (s.type === 'Polyline') {
            return <Polyline key={`street-${i}`} coordinates={s.coords} strokeColor="#FF0000" strokeWidth={2} lineCap="round" />;
          }
          return null;
        })}
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{visibleCount} / {fullStreetShapes.length}</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
// ...existing code...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});