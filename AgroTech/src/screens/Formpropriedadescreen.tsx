import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { propriedadeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CULTURAS = ['Soja', 'Milho', 'Café', 'Cana', 'Arroz', 'Trigo', 'Algodão', 'Outra'];
const CULT_ICON: Record<string, string> = {
  Soja: '🌱', Milho: '🌽', Café: '☕', Cana: '🎋',
  Arroz: '🍚', Trigo: '🌾', Algodão: '🤍', Outra: '🌿',
};

interface FormState {
  nomeFazenda:  string;
  estado:       string;
  municipio:    string;
  areaHectares: string;
  tipoCultura:  string;
  safra:        string;
}

interface FormErrors {
  nomeFazenda?:  string;
  estado?:       string;
  municipio?:    string;
  areaHectares?: string;
  tipoCultura?:  string;
}

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.nomeFazenda.trim()) e.nomeFazenda = 'Nome da fazenda é obrigatório';
  if (!f.estado.trim() || f.estado.trim().length !== 2) e.estado = 'Digite a sigla do estado (ex: SP)';
  if (!f.municipio.trim()) e.municipio = 'Município é obrigatório';
  if (!f.tipoCultura) e.tipoCultura = 'Selecione uma cultura';
  const area = parseFloat(f.areaHectares);
  if (isNaN(area) || area <= 0) e.areaHectares = 'Área deve ser maior que zero';
  return e;
}

export default function FormPropriedadeScreen({ route, navigation }: any) {
  const { produtor } = useAuth();
  const editing = route.params?.propriedade;
  const isEdit = !!editing?.id;

  const [form, setForm] = useState<FormState>({
    nomeFazenda:  editing?.nomeFazenda ?? '',
    estado:       editing?.estado ?? '',
    municipio:    editing?.municipio ?? '',
    areaHectares: editing?.areaHectares?.toString() ?? '',
    tipoCultura:  editing?.culturas?.[0]?.tipoCultura ?? '',
    safra:        editing?.culturas?.[0]?.safra ?? new Date().getFullYear().toString(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function set(field: keyof FormState) {
    return (value: string) => {
      setForm(f => ({ ...f, [field]: value }));
      if ((errors as any)[field]) setErrors(e => ({ ...e, [field]: undefined }));
    };
  }

  async function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const payload = {
      idProdutor:   produtor!.id,
      nomeFazenda:  form.nomeFazenda.trim(),
      estado:       form.estado.trim().toUpperCase(),
      municipio:    form.municipio.trim(),
      areaHectares: parseFloat(form.areaHectares),
      tipoCultura:  form.tipoCultura,
      safra:        form.safra || new Date().getFullYear().toString(),
    };

    try {
      if (isEdit) {
        await propriedadeService.atualizar(editing.id, payload);
        Alert.alert(
          '✅ Fazenda Atualizada!',
          `"${payload.nomeFazenda}" foi atualizada com sucesso.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        await propriedadeService.criar(payload as any);
        Alert.alert(
          '🌱 Fazenda Cadastrada!',
          `"${payload.nomeFazenda}" foi adicionada com sucesso!\n\nCultura: ${payload.tipoCultura}\nÁrea: ${payload.areaHectares} ha\nLocalização: ${payload.municipio}, ${payload.estado}`,
          [{ text: 'Ótimo!', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  }

  const localizacaoPreview = [form.municipio, form.estado.toUpperCase()].filter(Boolean).join(', ');
  const areaPreview = form.areaHectares
    ? `${form.areaHectares} ha · ${form.tipoCultura} · Safra ${form.safra}`
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{isEdit ? 'Editar Fazenda' : 'Nova Fazenda'}</Text>
          <Text style={styles.headerSubtitle}>{isEdit ? 'Atualize os dados' : 'Preencha os dados para cadastrar'}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Text style={styles.label}>Nome da Fazenda *</Text>
          <View style={[styles.inputBox, errors.nomeFazenda ? styles.inputError : null]}>
            <Text style={styles.inputIcon}>🏡</Text>
            <TextInput
              style={styles.input}
              value={form.nomeFazenda}
              onChangeText={set('nomeFazenda')}
              placeholder="Ex: Fazenda São João"
              placeholderTextColor="#4A6080"
              maxLength={80}
            />
          </View>
          {errors.nomeFazenda ? <Text style={styles.errText}>{errors.nomeFazenda}</Text> : null}

          <View style={styles.row}>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Estado *</Text>
              <View style={[styles.inputBox, errors.estado ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.estado}
                  onChangeText={(t) => set('estado')(t.toUpperCase())}
                  placeholder="SP"
                  placeholderTextColor="#4A6080"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
              {errors.estado ? <Text style={styles.errText}>{errors.estado}</Text> : null}
            </View>

            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Área (ha) *</Text>
              <View style={[styles.inputBox, errors.areaHectares ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  value={form.areaHectares}
                  onChangeText={set('areaHectares')}
                  placeholder="150"
                  placeholderTextColor="#4A6080"
                  keyboardType="decimal-pad"
                  maxLength={10}
                />
                <Text style={styles.unit}>ha</Text>
              </View>
              {errors.areaHectares ? <Text style={styles.errText}>{errors.areaHectares}</Text> : null}
            </View>
          </View>

          <Text style={styles.label}>Município *</Text>
          <View style={[styles.inputBox, errors.municipio ? styles.inputError : null]}>
            <Text style={styles.inputIcon}>📍</Text>
            <TextInput
              style={styles.input}
              value={form.municipio}
              onChangeText={set('municipio')}
              placeholder="Ex: Ribeirão Preto"
              placeholderTextColor="#4A6080"
              maxLength={80}
              autoCapitalize="words"
            />
          </View>
          {errors.municipio ? <Text style={styles.errText}>{errors.municipio}</Text> : null}

          <Text style={styles.label}>Safra</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputIcon}>📅</Text>
            <TextInput
              style={styles.input}
              value={form.safra}
              onChangeText={set('safra')}
              placeholder="2025"
              placeholderTextColor="#4A6080"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Cultura Plantada *</Text>
          {errors.tipoCultura ? <Text style={styles.errText}>{errors.tipoCultura}</Text> : null}
          <View style={styles.chipsGrid}>
            {CULTURAS.map(c => {
              const selected = form.tipoCultura === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => set('tipoCultura')(c)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chipIcon}>{CULT_ICON[c]}</Text>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {(form.nomeFazenda.trim() && form.tipoCultura) ? (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Prévia</Text>
              <Text style={styles.previewName}>{`${CULT_ICON[form.tipoCultura]} ${form.nomeFazenda}`}</Text>
              {localizacaoPreview ? <Text style={styles.previewSub}>{`📍 ${localizacaoPreview}`}</Text> : null}
              {areaPreview ? <Text style={styles.previewSub}>{`📐 ${areaPreview}`}</Text> : null}
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#000" size="small" />
              : <Text style={styles.submitText}>{isEdit ? '💾 Salvar Alterações' : '✅ Cadastrar Fazenda'}</Text>
            }
          </TouchableOpacity>

          {isEdit && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#060F1E' },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backBtn:          { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:      { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  headerSubtitle:   { color: '#4A6080', fontSize: 12, marginTop: 2 },
  scroll:           { paddingHorizontal: 20, paddingTop: 24 },
  row:              { flexDirection: 'row', gap: 12 },
  fieldHalf:        { flex: 1 },
  label:            { fontSize: 11, color: '#4A6080', marginBottom: 8, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  inputBox:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D1B2A', borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 14, marginBottom: 16 },
  inputError:       { borderColor: '#F44336' },
  inputIcon:        { fontSize: 16, marginRight: 8 },
  input:            { flex: 1, color: '#FFFFFF', fontSize: 15, paddingVertical: 14 },
  unit:             { fontSize: 13, color: '#4A6080' },
  errText:          { fontSize: 11, color: '#F44336', marginTop: -10, marginBottom: 10 },
  chipsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D1B2A', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.07)' },
  chipSelected:     { borderColor: Colors.primary, backgroundColor: 'rgba(0,245,160,0.08)' },
  chipIcon:         { fontSize: 14 },
  chipText:         { fontSize: 13, color: '#4A6080', fontWeight: '500' },
  chipTextSelected: { color: Colors.primary, fontWeight: '700' },
  preview:          { backgroundColor: '#0D1B2A', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderLeftWidth: 3, borderLeftColor: Colors.primary },
  previewLabel:     { fontSize: 10, color: '#4A6080', marginBottom: 6, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  previewName:      { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  previewSub:       { fontSize: 13, color: '#4A6080', marginTop: 4 },
  submitBtn:        { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  submitText:       { fontSize: 15, fontWeight: '800', color: '#000' },
  cancelBtn:        { paddingVertical: 14, alignItems: 'center' },
  cancelText:       { fontSize: 14, color: '#4A6080' },
});