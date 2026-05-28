import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "../styles/colors";

export default function PlantationScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Plantações
      </Text>

      <View style={styles.card}>
        <Text style={styles.name}>Milho</Text>
        <Text style={styles.status}>
          Status: Saudável
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Soja</Text>
        <Text style={styles.status}>
          Status: Irrigação moderada
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Café</Text>
        <Text style={styles.status}>
          Status: Necessita atenção
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 60,
    marginBottom: 30,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  name: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "800",
  },

  status: {
    color: Colors.textMuted,
    marginTop: 10,
    fontSize: 16,
  },
});