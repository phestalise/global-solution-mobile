// src/screens/AlertasScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { alertaService } from '../services/api';
import { Alerta } from '../types';
import { ScreenHeader, LoadingOverlay, EmptyState } from '../components';

// ── Mock ──────────────────────────────────────────────────────────────────────
const MOCK_ALERTAS: Alerta[] = [
  { id: 1, propriedadeId: 2, tipo: 'NDVI_BAIXO',    descricao: 'NDVI abaixo de 0.3 detectado na propriedade Sítio Estrela. Possível déficit hídrico ou ataque de pragas.',   nivel: 'ALTO',  ativo: true, createdAt: new Date().toISOString() },
  { id: 2, propriedadeId: 2, tipo: 'SECA',          descricao: 'Umidade do solo em 28% no Sítio Estrela. Recomenda-se irrigação imediata.',                                    nivel: 'ALTO',  ativo: true, createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: 3, propriedadeId: 3, tipo: 'PRAGA',         descricao: 'Índice NDVI com padrão irregular no Rancho Verde. Suspeita de infestação na área leste.',                       nivel: 'MEDIO', ativo: true, createdAt: new Date(Date.now() - 86_400_000).toISOString() },
  { id: 4, propriedadeId: 1, tipo: 'EXCESSO_CHUVA', descricao: 'Umidade acima de 90% na Fazenda São João. Risco de encharcamento nas zonas baixas.',                           nivel: 'BAIXO', ativo: true, createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString() },
];

const TIPO_ICON: Record<string, string>  = { NDVI_BAIXO: '🌿', SECA: '🔥', PRAGA: '🐛', EXCESSO_CHUVA: '🌊' };
const TIPO_LABEL: Record<string, string> = { NDVI_BAIXO: 'NDVI Baixo', SECA: 'Seca', PRAGA: 'Praga', EXCESSO_CHUVA: 'Excesso Chuva' };
const NIVEL_COLOR: Record<string, string> = { ALTO: Colors.accentRed, MEDIO: Colors.accent, BAIXO: Colors.primary };

// ── Filtro chips ──────────────────────────────────────────────────────────────
type Filtro = 'TODOS' | 'ALTO' | 'MEDIO' | 'BAIXO';

function FilterChips({ active, onChange }: { active: Filtro; onChange: (f: Filtro) => void }) {
  const opts: { key: Filtro; label: string; color: string }[] = [
    { key: 'TODOS', label: 'Todos',  color: Colors.textSecondary },
    { key: 'ALTO',  label: '🔴 Alto',  color: Colors.accentRed },
    { key: 'MEDIO', label: '🟡 Médio', color: Colors.accent },
    { key: 'BAIXO', label: '🟢 Baixo', color: Colors.primary },
  ];
  return (
    <View style={filterStyles.row}>
      {opts.map(o => (
        <TouchableOpacity
          key={o.key}
          style={[filterStyles.chip, active === o.key && { borderColor: o.color, backgroundColor: `${o.color}18` }]}
          onPress={() => onChange(o.key)}
        >
          <Text style={[filterStyles.chipText, active === o.key && { color: o.color, fontWeight: '700' }]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const filterStyles = StyleSheet.create({
  row:      { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md, flexWrap: 'wrap' },
  chip:     { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  chipText: { fontSize: 12, color: Colors.textSecondary },
});

// ── Card de alerta ────────────────────────────────────────────────────────────
function AlertaItem({ alerta, onResolve }: { alerta: Alerta; onResolve: (id: number) => void }) {
  const color = NIVEL_COLOR[alerta.nivel] ?? Colors.primary;
  const ago   = () => {
    const diff = Date.now() - new Date(alerta.createdAt).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 1) return 'Agora há pouco';
    if (h < 24) return `Há ${h}h`;
    return `Há ${Math.floor(h / 24)} dia${Math.floor(h / 24) > 1 ? 's' : ''}`;
  };

  return (
    <View style={[itemStyles.card, { borderLeftColor: color }]}>
      {/* Header */}
      <View style={itemStyles.header}>
        <View style={[itemStyles.iconBox, { backgroundColor: `${color}18` }]}>
          <Text style={itemStyles.icon}>{TIPO_ICON[alerta.tipo] ?? '⚠️'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.tipo}>{TIPO_LABEL[alerta.tipo] ?? alerta.tipo}</Text>
            <View style={[itemStyles.nivelBadge, { backgroundColor: `${color}22`, borderColor: color }]}>
              <Text style={[itemStyles.nivelText, { color }]}>{alerta.nivel}</Text>
            </View>
          </View>
          <Text style={itemStyles.ago}>{ago()}</Text>
        </View>
      </View>

      {/* Descrição */}
      <Text style={itemStyles.desc}>{alerta.descricao}</Text>

      {/* Ações */}
      <View style={itemStyles.actions}>
        <TouchableOpacity
          style={[itemStyles.resolveBtn, { borderColor: color }]}
          onPress={() => onResolve(alerta.id)}
        >
          <Text style={[itemStyles.resolveText, { color }]}>✓ Marcar como resolvido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  card:        { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.border },
  header:      { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  iconBox:     { width: 44, height: 44, borderRadius: Radius.sm, justifyContent: 'center', alignItems: 'center' },
  icon:        { fontSize: 22 },
  titleRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  tipo:        { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  nivelBadge:  { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
  nivelText:   { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ago:         { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  desc:        { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: Spacing.sm },
  actions:     { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  resolveBtn:  { alignSelf: 'flex-start', borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 5 },
  resolveText: { fontSize: 12, fontWeight: '700' },
});

// ── Tela principal ────────────────────────────────────────────────────────────
export default function AlertasScreen({ navigation }: any) {
  const [alertas,    setAlertas]    = useState<Alerta[]>([]);
  const [filtro,     setFiltro]     = useState<Filtro>('TODOS');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // ⚠️  Substitua 1 pelo id do produtor logado
      const res = await alertaService.listar(1);
      setAlertas(res.data);
    } catch {
      setAlertas(MOCK_ALERTAS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResolve = (id: number) => {
    Alert.alert('Resolver alerta', 'Confirma que este alerta foi tratado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar', onPress: async () => {
          try {
            await alertaService.resolver(id);
          } catch { /* silencioso */ }
          setAlertas(prev => prev.filter(a => a.id !== id));
        },
      },
    ]);
  };

  const filtered = filtro === 'TODOS'
    ? alertas
    : alertas.filter(a => a.nivel === filtro);

  const altoCount = alertas.filter(a => a.nivel === 'ALTO').length;

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Alertas"
        subtitle={alertas.length > 0 ? `${alertas.length} ativo${alertas.length > 1 ? 's' : ''}` : 'Tudo tranquilo'}
      />

      {altoCount > 0 && (
        <View style={styles.urgentBanner}>
          <Text style={styles.urgentText}>🚨 {altoCount} alerta{altoCount > 1 ? 's' : ''} de risco ALTO — ação necessária!</Text>
        </View>
      )}

      <FilterChips active={filtro} onChange={setFiltro} />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(true); }}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            message={filtro === 'TODOS' ? 'Nenhum alerta ativo. Sua lavoura está bem! 🌱' : `Sem alertas de nível ${filtro}.`}
            icon={filtro === 'TODOS' ? '✅' : '🔍'}
          />
        }
        renderItem={({ item }) => (
          <AlertaItem alerta={item} onResolve={handleResolve} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.bg },
  urgentBanner:  { marginHorizontal: Spacing.lg, marginBottom: Spacing.sm, backgroundColor: 'rgba(231,76,60,0.12)', borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.accentRed },
  urgentText:    { fontSize: 13, color: Colors.accentRed, fontWeight: '600', textAlign: 'center' },
  list:          { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
});