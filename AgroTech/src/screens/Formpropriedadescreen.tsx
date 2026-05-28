// src/screens/FormPropriedadeScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { propriedadeService } from '../services/api';
import { Propriedade } from '../types';
import { ScreenHeader } from '../components';

// ── Chips de cultura ──────────────────────────────────────────────────────────
const CULTURAS = ['Soja', 'Milho', 'Café', 'Cana', 'Arroz', 'Trigo', 'Algodão', 'Outra'];
const CULT_ICON: Record<string, string> = {
  Soja: '🌱', Milho: '🌽', Café: '☕', Cana: '🎋',
  Arroz: '🍚', Trigo: '🌾', Algodão: '🤍', Outra: '🌿',
};

// ── Helpers de validação ──────────────────────────────────────────────────────
interface FormState {
  nome: string;
  localizacao: string;
  cultura: string;
  areaHectares: string;
}

interface FormErrors {
  nome?: string;
  localizacao?: string;
  cultura?: string;
  areaHectares?: string;
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.nome.trim())         e.nome         = 'Nome da fazenda é obrigatório';
  if (!f.localizacao.trim())  e.localizacao  = 'Localização é obrigatória';
  if (!f.cultura)             e.cultura      = 'Selecione uma cultura';
  const area = parseFloat(f.areaHectares);
  if (isNaN(area) || area <= 0) e.areaHectares = 'Área deve ser maior que zero';
  return e;
}

// ── Tela ──────────────────────────────────────────────────────────────────────
export default function FormPropriedadeScreen({ route, navigation }: any) {
  const editing = route.params?.propriedade as Propriedade | undefined;
  const isEdit  = !!editing?.id;

  const [form, setForm] = useState<FormState>({
    nome:         editing?.nome         ?? '',
    localizacao:  editing?.localizacao  ?? '',
    cultura:      editing?.cultura      ?? '',
    areaHectares: editing?.areaHectares?.toString() ?? '',
  });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function set(field: keyof FormState) {
    return (value: string) => {
      setForm(f => ({ ...f, [field]: value }));
      if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
    };
  }

  async function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const payload = {
      nome:         form.nome.trim(),
      localizacao:  form.localizacao.trim(),
      cultura:      form.cultura,
      areaHectares: parseFloat(form.areaHectares),
      produtorId:   1, // ⚠️  substituir pelo id do produtor logado
    };

    try {
      if (isEdit) {
        await propriedadeService.atualizar(editing!.id, payload);
        Alert.alert('✅ Atualizado!', 'Propriedade atualizada com sucesso.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await propriedadeService.criar(payload);
        Alert.alert('✅ Cadastrado!', 'Nova propriedade adicionada.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={isEdit ? 'Editar Fazenda' : 'Nova Fazenda'}
        subtitle={isEdit ? 'Atualize os dados da propriedade' : 'Preencha os dados para cadastrar'}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Nome ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome da Fazenda *</Text>
            <View style={[styles.inputBox, errors.nome ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>🏡</Text>
              <TextInput
                style={styles.input}
                value={form.nome}
                onChangeText={set('nome')}
                placeholder="Ex: Fazenda São João"
                placeholderTextColor={Colors.textMuted}
                maxLength={80}
              />
            </View>
            {errors.nome ? <Text style={styles.errText}>{errors.nome}</Text> : null}
          </View>

          {/* ── Localização ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Localização *</Text>
            <View style={[styles.inputBox, errors.localizacao ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.input}
                value={form.localizacao}
                onChangeText={set('localizacao')}
                placeholder="Ex: Ribeirão Preto, SP"
                placeholderTextColor={Colors.textMuted}
                maxLength={120}
              />
            </View>
            {errors.localizacao ? <Text style={styles.errText}>{errors.localizacao}</Text> : null}
          </View>

          {/* ── Área ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Área (hectares) *</Text>
            <View style={[styles.inputBox, errors.areaHectares ? styles.inputError : null]}>
              <Text style={styles.inputIcon}>📐</Text>
              <TextInput
                style={styles.input}
                value={form.areaHectares}
                onChangeText={set('areaHectares')}
                placeholder="Ex: 150"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                maxLength={10}
              />
              <Text style={styles.unit}>ha</Text>
            </View>
            {errors.areaHectares ? <Text style={styles.errText}>{errors.areaHectares}</Text> : null}
          </View>

          {/* ── Cultura (chips) ── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cultura Plantada *</Text>
            {errors.cultura ? <Text style={styles.errText}>{errors.cultura}</Text> : null}
            <View style={styles.chipsGrid}>
              {CULTURAS.map(c => {
                const selected = form.cultura === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => set('cultura')(c)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.chipIcon}>{CULT_ICON[c]}</Text>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Preview ── */}
          {form.nome.trim() && form.cultura && (
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>Prévia</Text>
              <Text style={styles.previewName}>{CULT_ICON[form.cultura]} {form.nome}</Text>
              {form.localizacao ? <Text style={styles.previewSub}>📍 {form.localizacao}</Text> : null}
              {form.areaHectares ? <Text style={styles.previewSub}>📐 {form.areaHectares} ha · {form.cultura}</Text> : null}
            </View>
          )}

          {/* ── Botão ── */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.bg} size="small" />
              : <Text style={styles.submitText}>{isEdit ? '💾 Salvar Alterações' : '✅ Cadastrar Fazenda'}</Text>
            }
          </TouchableOpacity>

          {isEdit && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },

  fieldGroup: { marginBottom: Spacing.lg },
  label:      { fontSize: 12, color: Colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  inputBox:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, gap: Spacing.sm },
  inputError: { borderColor: Colors.accentRed },
  inputIcon:  { fontSize: 16 },
  input:      { flex: 1, color: Colors.textPrimary, fontSize: 15, paddingVertical: 14 },
  unit:       { fontSize: 13, color: Colors.textSecondary, paddingRight: 4 },
  errText:    { fontSize: 11, color: Colors.accentRed, marginTop: 5 },

  chipsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip:            { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.bgCard, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: Colors.border },
  chipSelected:    { borderColor: Colors.primary, backgroundColor: Colors.primaryGlow },
  chipIcon:        { fontSize: 14 },
  chipText:        { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextSelected:{ color: Colors.primary, fontWeight: '700' },

  preview:      { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  previewTitle: { fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: '600', letterSpacing: 0.5 },
  previewName:  { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  previewSub:   { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  submitBtn:      { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 16, alignItems: 'center', marginBottom: Spacing.sm, shadowColor: Colors.primary, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  submitDisabled: { opacity: 0.6 },
  submitText:     { fontSize: 15, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },

  cancelBtn:  { paddingVertical: 14, alignItems: 'center' },
  cancelText: { fontSize: 14, color: Colors.textMuted },
});