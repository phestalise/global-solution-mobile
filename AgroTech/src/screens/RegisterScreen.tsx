import React from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Colors } from "../styles/colors";

export default function RegisterScreen({ navigation }: any) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Criar Conta</Text>

      <Text style={styles.subtitle}>
        Cadastro agrícola inteligente
      </Text>

      <TextInput
        placeholder="Nome do produtor"
        placeholderTextColor="#7E8A97"
        style={styles.input}
      />

      <TextInput
        placeholder="Tipo de plantação"
        placeholderTextColor="#7E8A97"
        style={styles.input}
      />

      <TextInput
        placeholder="Tamanho da fazenda"
        placeholderTextColor="#7E8A97"
        style={styles.input}
      />

      <TextInput
        placeholder="Região agrícola"
        placeholderTextColor="#7E8A97"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#7E8A97"
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#7E8A97"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.buttonText}>
          Criar conta
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 50,
  },

  subtitle: {
    color: Colors.textMuted,
    marginTop: 10,
    marginBottom: 40,
    fontSize: 16,
  },

  input: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    height: 58,
    paddingHorizontal: 20,
    color: Colors.text,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  button: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
});