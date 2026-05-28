import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={50}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.name}>
        Paulo Henrique
      </Text>

      <Text style={styles.role}>
        Produtor Agrícola
      </Text>

      <View style={styles.card}>
        <Text style={styles.info}>
          Fazenda: AgroTech Valley
        </Text>

        <Text style={styles.info}>
          Cultura: Soja e Milho
        </Text>

        <Text style={styles.info}>
          Região: São Paulo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    padding: 24,
    paddingTop: 100,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  name: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 24,
  },

  role: {
    color: Colors.textMuted,
    marginTop: 8,
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  info: {
    color: Colors.text,
    fontSize: 18,
    marginBottom: 16,
  },
});