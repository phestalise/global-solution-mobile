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

export default function RegisterScreen({ navigation }: any) {
  const [secureText, setSecureText] = useState(true);
  const [nome, setNome] = useState("");
  const [tipoPlantacao, setTipoPlantacao] = useState("");
  const [tamanhoFazenda, setTamanhoFazenda] = useState("");
  const [regiao, setRegiao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleTestRegister = () => {
    // Pular cadastro e ir direto ao Dashboard (teste)
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
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#06111F", "#081B33", "#0A223D"]}
          style={styles.gradient}
        >
          <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Cadastro agrícola inteligente</Text>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              {/* Nome do produtor */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput
                  placeholder="Nome do produtor"
                  placeholderTextColor="#7E8A97"
                  value={nome}
                  onChangeText={setNome}
                  style={styles.input}
                />
              </View>

              {/* Tipo de plantação */}
              <View style={styles.inputContainer}>
                <Ionicons name="flower-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput
                  placeholder="Tipo de plantação (ex: soja, milho)"
                  placeholderTextColor="#7E8A97"
                  value={tipoPlantacao}
                  onChangeText={setTipoPlantacao}
                  style={styles.input}
                />
              </View>

              {/* Tamanho da fazenda */}
              <View style={styles.inputContainer}>
                <Ionicons name="resize-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput
                  placeholder="Tamanho da fazenda (hectares)"
                  placeholderTextColor="#7E8A97"
                  value={tamanhoFazenda}
                  onChangeText={setTamanhoFazenda}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              {/* Região agrícola */}
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput
                  placeholder="Região agrícola"
                  placeholderTextColor="#7E8A97"
                  value={regiao}
                  onChangeText={setRegiao}
                  style={styles.input}
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#7E8A97" style={styles.icon} />
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
                <Ionicons name="lock-closed-outline" size={20} color="#7E8A97" style={styles.icon} />
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#7E8A97"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={secureText}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
                  <Ionicons
                    name={secureText ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#7E8A97"
                  />
                </TouchableOpacity>
              </View>

              {/* Botão Criar conta */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Dashboard")}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle-outline" size={22} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.registerButtonText}>Criar conta</Text>
              </TouchableOpacity>

              {/* Botão de teste */}
              <TouchableOpacity
                style={styles.testButton}
                onPress={handleTestRegister}
                activeOpacity={0.85}
              >
                <Ionicons name="flask-outline" size={20} color="#FFD966" style={{ marginRight: 8 }} />
                <Text style={styles.testButtonText}>Testar sem cadastro</Text>
              </TouchableOpacity>
            </View>

            {/* Rodapé */}
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
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
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
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 6,
  },
  form: {
    marginBottom: 20,
  },
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
  icon: {
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
  registerButtonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
  testButton: {
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 217, 102, 0.08)",
    borderWidth: 1,
    borderColor: "#FFD966",
    marginBottom: 16,
  },
  testButtonText: {
    color: "#FFD966",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
});