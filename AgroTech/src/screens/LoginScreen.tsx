import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Colors } from "../styles/colors";

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <Text style={styles.subtitle}>
        Acesse sua central agrícola
      </Text>

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
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    color: Colors.text,
    fontSize: 34,
    fontWeight: "900",
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
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  button: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
  },
});