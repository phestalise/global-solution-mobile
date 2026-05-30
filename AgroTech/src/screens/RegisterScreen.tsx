import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { produtorService } from "../services/api";

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoPlantacao, setTipoPlantacao] = useState("");
  const [tamanhoFazenda, setTamanhoFazenda] = useState("");
  const [regiao, setRegiao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !cpf.trim()) {
      Alert.alert("Campos obrigatórios", "Nome e CPF são necessários.");
      return;
    }

    const dados = {
      nome,
      cpf: cpf.replace(/\D/g, ""),
      tipoPlantacao,
      tamanhoFazenda: Number(tamanhoFazenda) || 0,
      regiao,
    };

    setLoading(true);
    try {
      await produtorService.create(dados);
      Alert.alert("Sucesso", "Cadastro realizado! Faça login com seu CPF.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha no cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.gradient}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Cadastro agrícola inteligente</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput placeholder="Nome do produtor" placeholderTextColor="#7E8A97" value={nome} onChangeText={setNome} style={styles.input} editable={!loading} />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput placeholder="CPF (apenas números)" placeholderTextColor="#7E8A97" value={cpf} onChangeText={(t) => setCpf(t.replace(/\D/g, ""))} keyboardType="numeric" maxLength={11} style={styles.input} editable={!loading} />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="flower-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput placeholder="Tipo de plantação (ex: soja, milho)" placeholderTextColor="#7E8A97" value={tipoPlantacao} onChangeText={setTipoPlantacao} style={styles.input} editable={!loading} />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="resize-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput placeholder="Tamanho da fazenda (hectares)" placeholderTextColor="#7E8A97" value={tamanhoFazenda} onChangeText={setTamanhoFazenda} keyboardType="numeric" style={styles.input} editable={!loading} />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput placeholder="Região agrícola" placeholderTextColor="#7E8A97" value={regiao} onChangeText={setRegiao} style={styles.input} editable={!loading} />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#000" style={{ marginRight: 8 }} />
                    <Text style={styles.registerButtonText}>Criar conta</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Entrar</Text>
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
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 30, justifyContent: "space-between" },
  header: { alignItems: "center", marginBottom: 30 },
  logoCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#10263B", justifyContent: "center", alignItems: "center", marginBottom: 20, borderWidth: 2, borderColor: Colors.primary + "40" },
  title: { color: Colors.text, fontSize: 32, fontWeight: "900", letterSpacing: -0.5 },
  subtitle: { color: Colors.textMuted, fontSize: 15, marginTop: 6 },
  form: { marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.card, borderRadius: 16, height: 56, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  icon: { marginLeft: 16, marginRight: 10 },
  input: { flex: 1, color: Colors.text, fontSize: 16, height: "100%" },
  registerButton: { backgroundColor: Colors.primary, height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", flexDirection: "row", marginTop: 8, marginBottom: 14 },
  registerButtonText: { color: "#000", fontWeight: "800", fontSize: 18 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 20 },
  footerText: { color: Colors.textMuted, fontSize: 15 },
  loginLink: { color: Colors.primary, fontSize: 15, fontWeight: "700" },
});