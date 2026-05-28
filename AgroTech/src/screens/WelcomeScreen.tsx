import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../styles/colors";

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#06111F", "#081B33", "#0A223D"]}
        style={styles.background}
      >
        <View style={styles.top}>
          <View style={styles.logoBox}>
            <Ionicons
              name="leaf"
              size={42}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>AgroTech</Text>

          <Text style={styles.subtitle}>
            Monitoramento agrícola inteligente com análise
            orbital, sensores e dados climáticos.
          </Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.infoCard}>
            <Ionicons
              name="planet"
              size={24}
              color={Colors.primary}
            />

            <Text style={styles.cardTitle}>
              Satélites em tempo real
            </Text>

            <Text style={styles.cardText}>
              Dados climáticos e análise da plantação.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons
              name="water"
              size={24}
              color={Colors.secondary}
            />

            <Text style={styles.cardTitle}>
              Controle de irrigação
            </Text>

            <Text style={styles.cardText}>
              Monitoramento inteligente da umidade.
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 60,
  },

  top: {
    alignItems: "center",
    marginTop: 40,
  },

  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "#10263B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    color: Colors.text,
    fontSize: 42,
    fontWeight: "900",
  },

  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },

  cards: {
    gap: 20,
  },

  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },

  cardText: {
    color: Colors.textMuted,
    marginTop: 10,
    lineHeight: 22,
  },

  buttons: {
    gap: 16,
  },

  loginButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "800",
  },

  registerButton: {
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  registerText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
});