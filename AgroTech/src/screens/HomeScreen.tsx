import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../styles/colors';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#050816', '#071124', '#0B1120']}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>
          Central Orbital
        </Text>

        <Text style={styles.subtitle}>
          Monitoramento agrícola via satélite
        </Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.label}>NDVI</Text>
            <Text style={styles.value}>0.84</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Clima</Text>
            <Text style={styles.value}>28°C</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Umidade</Text>
            <Text style={styles.value}>74%</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Risco</Text>
            <Text style={styles.value}>Baixo</Text>
          </View>
        </View>

        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>
            IA ORBITAL
          </Text>

          <Text style={styles.aiText}>
            87% de chance de seca nos próximos 5 dias.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 50,
  },

  subtitle: {
    color: Colors.muted,
    marginTop: 8,
    marginBottom: 32,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#0D1328',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  label: {
    color: Colors.muted,
    fontSize: 14,
  },

  value: {
    color: Colors.primary,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 12,
  },

  aiBox: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#00F5A050',
    marginTop: 20,
  },
aiTitle: {
    color: Colors.secondary,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 2,
  },

  aiText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});