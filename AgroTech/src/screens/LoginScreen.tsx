// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { produtorService } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email,   setEmail]   = useState('');
  const [senha,   setSenha]   = useState('');
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<{ email?: string; senha?: string }>({});
  const [showPass, setShowPass] = useState(false);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim())                    e.email = 'E-mail obrigatório';
    else if (!email.includes('@'))        e.email = 'E-mail inválido';
    if (!senha || senha.length < 4)       e.senha = 'Senha deve ter ao menos 4 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await produtorService.login(email.trim(), senha);
      // ⚠️  Aqui você pode salvar o token JWT retornado:
      // await AsyncStorage.setItem('token', response.data.token);
      navigation.replace('MainTabs');
    } catch (err: any) {
      Alert.alert('Falha no login', err.message || 'Credenciais incorretas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Background decorativo ── */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgDot1} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo / Marca ── */}
          <View style={styles.logoBlock}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🛰️</Text>
            </View>
            <Text style={styles.appName}>AstroFarm</Text>
            <Text style={styles.tagline}>Monitoramento Agrícola via Satélite</Text>
          </View>

          {/* ── Card de login ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na plataforma</Text>

            {/* E-mail */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputBox, errors.senha ? styles.inputError : null]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
            </View>

            {/* Botão login */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.bg} size="small" />
                : <Text style={styles.loginBtnText}>Acessar →</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo / dev shortcut */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => navigation.replace('MainTabs')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnText}>Entrar sem API (demonstração)</Text>
            </TouchableOpacity>
          </View>

          {/* ── Rodapé ── */}
          <Text style={styles.footer}>
            AstroFarm © 2026 · ODS 2 · ODS 13
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  kav:   { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },

  // Decorações de fundo
  bgCircle1: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: Colors.primaryGlow,
  },
  bgCircle2: {
    position: 'absolute', bottom: 60, left: -100,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(52,152,219,0.08)',
  },
  bgDot1: {
    position: 'absolute', top: 180, left: 30,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.primary, opacity: 0.6,
  },

  // Logo
  logoBlock:  { alignItems: 'center', paddingTop: 56, marginBottom: Spacing.xl },
  logoIcon:   {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  logoEmoji:  { fontSize: 36 },
  appName:    { fontSize: 30, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 1 },
  tagline:    { fontSize: 13, color: Colors.textSecondary, marginTop: 6, textAlign: 'center' },

  // Card
  card:       {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.xl,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  cardTitle:  { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.lg },

  // Fields
  fieldGroup: { marginBottom: Spacing.md },
  label:      { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, fontWeight: '600', letterSpacing: 0.5 },
  inputBox:   {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, gap: Spacing.sm,
  },
  inputError: { borderColor: Colors.accentRed },
  inputIcon:  { fontSize: 14 },
  input:      { color: Colors.textPrimary, fontSize: 15, paddingVertical: 13 },
  eyeBtn:     { padding: 4 },
  eyeIcon:    { fontSize: 16 },
  errorText:  { fontSize: 11, color: Colors.accentRed, marginTop: 4 },

  // Botões
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText:     { fontSize: 16, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },

  divider:     { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md, gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: 12 },

  demoBtn:     { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  demoBtnText: { color: Colors.textSecondary, fontSize: 13 },

  footer: { textAlign: 'center', color: Colors.textMuted, fontSize: 11, marginTop: 'auto' },
});