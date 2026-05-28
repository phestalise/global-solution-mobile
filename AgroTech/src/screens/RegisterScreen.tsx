import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import OrbitInput from '../components/OrbitInput';
import OrbitButton from '../components/OrbitButton';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../styles/colors';

export default function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={['#050816', '#0B1120', '#111827']}
      style={styles.container}
    >
      <Text style={styles.title}>Nova Conta Orbital</Text>

      <View style={styles.card}>
        <OrbitInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

        <OrbitInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <OrbitInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <OrbitButton
          title="CRIAR CONTA"
          onPress={() =>
            register(name, email, password)
          }
        />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 32,
  },

  card: {
    backgroundColor: '#0D1328EE',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});