import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrbitInput from '../components/OrbitInput';
import OrbitButton from '../components/OrbitButton';
import { Colors } from '../styles/colors';
import { produtorService } from '../services/api';
import { Produtor } from '../types';

export default function EditProfileScreen() {
  const [produtor, setProdutor] = useState<Produtor | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('produtor');
        if (json) {
          const p: Produtor = JSON.parse(json);
          setProdutor(p);
          setNome(p.nome || '');
          setTelefone(p.telefone || '');
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!produtor) return;
    setSaving(true);
    try {
      const dadosAtualizados = {
        nome,
        telefone,
        cpf: produtor.cpf, // CPF é obrigatório no modelo
      };
      const response = await produtorService.update(produtor.id, dadosAtualizados);
      const atualizado = response.data;
      await AsyncStorage.setItem('produtor', JSON.stringify(atualizado));
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <OrbitInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <OrbitInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <OrbitButton
        title={saving ? 'SALVANDO...' : 'SALVAR'}
        onPress={handleSave}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
});