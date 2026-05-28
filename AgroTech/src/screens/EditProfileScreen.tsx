import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import OrbitInput from '../components/OrbitInput';
import OrbitButton from '../components/OrbitButton';
import { Colors } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <View style={styles.container}>
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

      <OrbitButton
        title="SALVAR"
        onPress={() => updateProfile(name, email)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 24,
    justifyContent: 'center',
  },
});