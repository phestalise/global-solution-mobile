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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { produtorService } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Formatação de CPF e telefone
function formatarCpf(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // 👈 mensagem de erro na tela
  const { login } = useAuth();

  // Handlers que limpam o erro ao digitar
  const handleCpfChange = (text: string) => {
    setCpf(formatarCpf(text));
    setErrorMsg("");
  };
  const handleTelefoneChange = (text: string) => {
    setTelefone(formatarTelefone(text));
    setErrorMsg("");
  };

  const handleRegister = async () => {
    setErrorMsg(""); // limpa erros anteriores
    if (loading) return;

    const cpfDigits = cpf.replace(/\D/g, "");

    // Validações locais (mostram erro na tela)
    if (!nome.trim() || !cpf.trim() || !estado.trim() || !cidade.trim()) {
      setErrorMsg("Nome, CPF, Estado e Cidade são obrigatórios.");
      return;
    }
    if (cpfDigits.length !== 11) {
      setErrorMsg("CPF inválido. Digite os 11 dígitos.");
      return;
    }
    if (estado.trim().length !== 2) {
      setErrorMsg("Estado inválido. Use a sigla com 2 letras (ex: SP).");
      return;
    }
    if (senha.length < 6) {
      setErrorMsg("Senha muito curta. Mínimo de 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setErrorMsg("As senhas não conferem.");
      return;
    }

    const dados = {
      nome: nome.trim(),
      cpf: cpf,
      estado: estado.trim().toUpperCase(),
      cidade: cidade.trim(),
      email: email.trim() || "",
      telefone: telefone.trim() || "",
      senha: senha,
    };

    setLoading(true);
    try {
      await produtorService.create(dados);
      // Cadastro bem‑sucedido → loga automaticamente
      const loginResponse = await produtorService.login(cpfDigits, senha);
      await login(loginResponse.data);
    } catch (error: any) {
      // O interceptor do api.ts já retorna um Error com a mensagem da API
      setErrorMsg(error.message || "Falha no cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#06111F", "#081B33", "#0A223D"]}
          style={styles.gradient}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Cadastro de produtor</Text>
            </View>

            <View style={styles.form}>
              {/* 🔴 CAIXA DE ERRO VISÍVEL (só aparece se houver mensagem) */}
              {errorMsg !== "" && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#fff" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Nome completo"
                  placeholderTextColor="#7E8A97"
                  value={nome}
                  onChangeText={(t) => {
                    setNome(t);
                    setErrorMsg("");
                  }}
                  style={styles.input}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="CPF (000.000.000-00)"
                  placeholderTextColor="#7E8A97"
                  value={cpf}
                  onChangeText={handleCpfChange}
                  keyboardType="numeric"
                  maxLength={14}
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="flag-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Estado (ex: SP)"
                  placeholderTextColor="#7E8A97"
                  value={estado}
                  onChangeText={(t) => {
                    setEstado(t.toUpperCase());
                    setErrorMsg("");
                  }}
                  style={styles.input}
                  editable={!loading}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Cidade"
                  placeholderTextColor="#7E8A97"
                  value={cidade}
                  onChangeText={(t) => {
                    setCidade(t);
                    setErrorMsg("");
                  }}
                  style={styles.input}
                  editable={!loading}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Email (opcional)"
                  placeholderTextColor="#7E8A97"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErrorMsg("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Telefone (opcional)"
                  placeholderTextColor="#7E8A97"
                  value={telefone}
                  onChangeText={handleTelefoneChange}
                  keyboardType="phone-pad"
                  maxLength={15}
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              {/* SENHA (sempre oculta) */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Senha (mínimo 6 caracteres)"
                  placeholderTextColor="#7E8A97"
                  value={senha}
                  onChangeText={(t) => {
                    setSenha(t);
                    setErrorMsg("");
                  }}
                  secureTextEntry={true}
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              {/* CONFIRMAR SENHA (sempre oculta) */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#7E8A97"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Confirmar senha"
                  placeholderTextColor="#7E8A97"
                  value={confirmarSenha}
                  onChangeText={(t) => {
                    setConfirmarSenha(t);
                    setErrorMsg("");
                  }}
                  secureTextEntry={true}
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && { opacity: 0.7 },
                ]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={22}
                      color="#000"
                      style={{ marginRight: 8 }}
                    />
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
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  header: { alignItems: "center", marginBottom: 30 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#10263B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primary + "40",
  },
  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: { color: Colors.textMuted, fontSize: 15, marginTop: 6 },
  form: { marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { marginLeft: 16, marginRight: 10 },
  input: { flex: 1, color: Colors.text, fontSize: 16, height: "100%" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c", // vermelho chamativo
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 14,
  },
  registerButtonText: { color: "#000", fontWeight: "800", fontSize: 18 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: { color: Colors.textMuted, fontSize: 15 },
  loginLink: { color: Colors.primary, fontSize: 15, fontWeight: "700" },
});