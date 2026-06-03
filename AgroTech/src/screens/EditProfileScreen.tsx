import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { produtorService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0,2)})${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)})${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)})${digits.slice(2,7)}-${digits.slice(7)}`;
}

export default function EditProfileScreen({ navigation }: any) {
  const { produtor, login } = useAuth();

  const [nome,          setNome]          = useState(produtor?.nome     ?? '');
  const [email,         setEmail]         = useState(produtor?.email    ?? '');
  const [telefone,      setTelefone]      = useState(produtor?.telefone ?? '');
  const [senha,         setSenha]         = useState('');
  const [confirmar,     setConfirmar]     = useState('');
  const [secSenha,      setSecSenha]      = useState(true);
  const [secConfirmar,  setSecConfirmar]  = useState(true);
  const [saving,        setSaving]        = useState(false);

  const handleSave = async () => {
    if (!produtor) return;

    if (!nome.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode ficar vazio.');
      return;
    }

    if (senha && senha.length < 6) {
      Alert.alert('Senha curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha && senha !== confirmar) {
      Alert.alert('Senhas diferentes', 'As senhas digitadas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        nome:     nome.trim(),
        email:    email.trim(),
        telefone: telefone.trim(),
        cpf:      produtor.cpf,
      };

      if (senha) payload.senha = senha;

      const response = await produtorService.update(produtor.id, payload);
      await login(response.data);

      Alert.alert('Sucesso', 'Perfil atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <Text style={styles.headerSubtitle}>Atualize seus dados pessoais</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Text style={styles.sectionLabel}>Dados Pessoais</Text>

          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor="#4A6080"
              autoCapitalize="words"
              maxLength={100}
            />
          </View>

          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#4A6080"
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={200}
            />
          </View>

          <Text style={styles.label}>Telefone</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={(t) => setTelefone(formatarTelefone(t))}
              placeholder="(11) 99999-9999"
              placeholderTextColor="#4A6080"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <Text style={styles.label}>CPF</Text>
          <View style={[styles.inputBox, styles.inputDisabled]}>
            <Ionicons name="card-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <Text style={styles.inputReadOnly}>{produtor?.cpf ?? '—'}</Text>
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Alterar Senha</Text>
          <Text style={styles.sectionHint}>Deixe em branco para manter a senha atual</Text>

          <Text style={styles.label}>Nova senha</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#4A6080"
              secureTextEntry={secSenha}
            />
            <TouchableOpacity onPress={() => setSecSenha(!secSenha)} style={styles.eyeBtn}>
              <Ionicons name={secSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#4A6080" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar nova senha</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={18} color="#4A6080" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="Repita a nova senha"
              placeholderTextColor="#4A6080"
              secureTextEntry={secConfirmar}
            />
            <TouchableOpacity onPress={() => setSecConfirmar(!secConfirmar)} style={styles.eyeBtn}>
              <Ionicons name={secConfirmar ? 'eye-off-outline' : 'eye-outline'} size={20} color="#4A6080" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color="#000" size="small" />
              : <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Salvar Alterações</Text>
                </>
            }
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#060F1E' },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backBtn:        { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:    { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: '#4A6080', fontSize: 12, marginTop: 2 },
  scroll:         { paddingHorizontal: 20, paddingTop: 24 },
  sectionLabel:   { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 },
  sectionHint:    { color: '#4A6080', fontSize: 12, marginBottom: 16 },
  label:          { color: '#4A6080', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  inputBox:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1B2A', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 14, marginBottom: 4 },
  inputDisabled:  { opacity: 0.5 },
  inputIcon:      { marginRight: 10 },
  input:          { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 14 },
  inputReadOnly:  { flex: 1, color: '#4A6080', fontSize: 15, paddingVertical: 14 },
  eyeBtn:         { padding: 8 },
  saveBtn:        { flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: 28 },
  saveBtnText:    { color: '#000', fontWeight: '800', fontSize: 15 },
});