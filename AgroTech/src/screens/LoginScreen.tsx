import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { produtorService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Alert.alert("CPF inválido", "Digite um CPF de 11 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const response = await produtorService.login(cpfLimpo);
      const produtor = response.data;
      await login(produtor); // atualiza o contexto → isAuthenticated = true
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.gradient}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="person-circle-outline" size={60} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Entrar</Text>
              <Text style={styles.subtitle}>Informe seu CPF</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#7E8A97" style={styles.inputIcon} />
                <TextInput
                  placeholder="CPF (apenas números)"
                  placeholderTextColor="#7E8A97"
                  value={cpf}
                  onChangeText={(text) => setCpf(text.replace(/\D/g, ""))}
                  keyboardType="numeric"
                  maxLength={11}
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem cadastro? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 80, paddingBottom: 30, justifyContent: "space-between" },
  header: { alignItems: "center", marginBottom: 20 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#10263B", justifyContent: "center", alignItems: "center", marginBottom: 24, borderWidth: 2, borderColor: Colors.primary + "40" },
  title: { color: Colors.text, fontSize: 34, fontWeight: "900", letterSpacing: -0.5 },
  subtitle: { color: Colors.textMuted, fontSize: 16, marginTop: 8 },
  form: { flex: 1, justifyContent: "center", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.card, borderRadius: 16, height: 58, marginBottom: 18, borderWidth: 1, borderColor: Colors.border },
  inputIcon: { marginLeft: 16, marginRight: 10 },
  input: { flex: 1, color: Colors.text, fontSize: 16, height: "100%" },
  loginButton: { backgroundColor: Colors.primary, height: 58, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  loginButtonText: { color: "#000", fontWeight: "800", fontSize: 18 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 10 },
  footerText: { color: Colors.textMuted, fontSize: 15 },
  registerLink: { color: Colors.primary, fontSize: 15, fontWeight: "700" },
});