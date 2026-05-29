import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [secureText, setSecureText] = useState(true);

  // Login de teste sem API
  const handleTestLogin = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={["#06111F", "#081B33", "#0A223D"]}
          style={styles.gradient}
        >
          <View style={styles.container}>
            {/* Cabeçalho com ícone */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="person-circle-outline" size={60} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Entrar</Text>
              <Text style={styles.subtitle}>Acesse sua central agrícola</Text>
            </View>

            {/* Campos */}
            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#7E8A97" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#7E8A97"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              {/* Senha */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#7E8A97" style={styles.inputIcon} />
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#7E8A97"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={secureText}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={secureText ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#7E8A97"
                  />
                </TouchableOpacity>
              </View>

              {/* Esqueci a senha */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueci a senha?</Text>
              </TouchableOpacity>

              {/* Botão de Login */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Dashboard")}
                activeOpacity={0.85}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>

              {/* Login de teste */}
              <TouchableOpacity
                style={styles.testLoginButton}
                onPress={handleTestLogin}
                activeOpacity={0.85}
              >
                <Ionicons name="flask-outline" size={20} color="#FFD966" style={{ marginRight: 8 }} />
                <Text style={styles.testLoginText}>Login de teste (sem API)</Text>
              </TouchableOpacity>
            </View>

            {/* Rodapé com link para registro */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Criar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10263B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primary + "40", // borda sutil
  },
  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    height: 58,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
  testLoginButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 217, 102, 0.08)",
    borderWidth: 1,
    borderColor: "#FFD966",
    marginBottom: 20,
  },
  testLoginText: {
    color: "#FFD966",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: 10,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});