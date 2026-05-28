import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";

export default function DashboardScreen({
  navigation,
}: any) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AgroTech Dashboard</Text>

      <Text style={styles.subtitle}>
        Monitoramento orbital da fazenda
      </Text>

      <View style={styles.card}>
        <Ionicons
          name="leaf"
          size={34}
          color={Colors.primary}
        />

        <Text style={styles.cardTitle}>
          Saúde da plantação
        </Text>

        <Text style={styles.cardValue}>92%</Text>
      </View>

      <View style={styles.card}>
        <Ionicons
          name="rainy"
          size={34}
          color={Colors.secondary}
        />

        <Text style={styles.cardTitle}>
          Umidade do solo
        </Text>

        <Text style={styles.cardValue}>68%</Text>
      </View>

      <View style={styles.card}>
        <Ionicons
          name="sunny"
          size={34}
          color="#FFD166"
        />

        <Text style={styles.cardTitle}>
          Temperatura
        </Text>

        <Text style={styles.cardValue}>27°C</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Plantation")}
      >
        <Text style={styles.buttonText}>
          Ver plantações
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.secondaryText}>
          Meu perfil
        </Text>
      </TouchableOpacity>
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
  },

  subtitle: {
    color: Colors.textMuted,
    marginTop: 10,
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

  cardTitle: {
    color: Colors.textMuted,
    marginTop: 12,
    fontSize: 16,
  },

  cardValue: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 12,
  },

  button: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },

  secondaryButton: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: 16,
    marginBottom: 50,
  },

  secondaryText: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 18,
  },
});