import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOPO */}
          <View style={styles.top}>
            <View style={styles.logoBox}>
              <Ionicons name="leaf" size={36} color={Colors.primary} />
            </View>

            <Text style={styles.title}>AgroTech</Text>

            <Text style={styles.subtitle}>
              Monitoramento agrícola inteligente com análise orbital, sensores e
              dados climáticos.
            </Text>
          </View>

          {/* CARDS */}
          <View style={styles.cards}>
            <View style={styles.infoCard}>
              <Ionicons name="planet" size={22} color={Colors.primary} />
              <Text style={styles.cardTitle}>Satélites em tempo real</Text>
              <Text style={styles.cardText}>
                Dados climáticos e análise da plantação.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="water" size={22} color={Colors.secondary} />
              <Text style={styles.cardTitle}>Controle de irrigação</Text>
              <Text style={styles.cardText}>
                Monitoramento inteligente da umidade.
              </Text>
            </View>
          </View>

          {/* BOTÕES PRINCIPAIS */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.85}
            >
              <Text style={styles.loginText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.85}
            >
              <Text style={styles.registerText}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 50 : 70,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  top: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#10263B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  cards: {
    gap: 16,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 14,
  },
  cardText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  buttons: {
    gap: 14,
    marginTop: "auto",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "800",
  },
  registerButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  registerText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "800",
  },
});