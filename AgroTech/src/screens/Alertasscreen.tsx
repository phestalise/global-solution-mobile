import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, Alert,
} from 'react-native';
import { Colors } from '../styles/colors';
import { alertaService } from '../services/api';
import { Alerta } from '../types';
import { ScreenHeader, LoadingOverlay, EmptyState } from '../components';

const MOCK_ALERTAS: Alerta[] = [
  { id: 1, propriedadeId: 2, tipo: 'praga', mensagem: 'NDVI abaixo de 0.3 detectado na propriedade Sítio Estrela. Possível déficit hídrico ou ataque de pragas.', gravidade: 'alta', ativo: true, createdAt: new Date().toISOString() },
  { id: 2, propriedadeId: 2, tipo: 'clima', mensagem: 'Umidade do solo em 28% no Sítio Estrela. Recomenda-se irrigação imediata.', gravidade: 'alta', ativo: true, createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: 3, propriedadeId: 3, tipo: 'praga', mensagem: 'Índice NDVI com padrão irregular no Rancho Verde. Suspeita de infestação na área leste.', gravidade: 'média', ativo: true, createdAt: new Date(Date.now() - 86_400_000).toISOString() },
  { id: 4, propriedadeId: 1, tipo: 'clima', mensagem: 'Umidade acima de 90% na Fazenda São João. Risco de encharcamento nas zonas baixas.', gravidade: 'baixa', ativo: true, createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString() },
];

const TIPO_ICON: Record<string, string> = { praga: '🐛', clima: '🌊', seca: '🔥', ndvi_baixo: '🌿' };
const TIPO_LABEL: Record<string, string> = { praga: 'Praga', clima: 'Clima', seca: 'Seca', ndvi_baixo: 'NDVI Baixo' };
const GRAVIDADE_COLOR: Record<string, string> = { alta: '#E74C3C', média: '#F39C12', baixa: '#2ECC71' };

type Filtro = 'TODOS' | 'ALTA' | 'MÉDIA' | 'BAIXA';

function FilterChips({ active, onChange }: { active: Filtro; onChange: (f: Filtro) => void }) {
  const opts: { key: Filtro; label: string; color: string }[] = [
    { key: 'TODOS', label: 'Todos', color: '#7E8A97' },
    { key: 'ALTA', label: '🔴 Alta', color: '#E74C3C' },
    { key: 'MÉDIA', label: '🟡 Média', color: '#F39C12' },
    { key: 'BAIXA', label: '🟢 Baixa', color: '#2ECC71' },
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
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16, flexWrap: 'wrap' },
  chip: { borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.card },
  chipText: { fontSize: 12, color: Colors.textMuted },
});

function AlertaItem({ alerta, onResolve }: { alerta: Alerta; onResolve: (id: number) => void }) {
  const color = GRAVIDADE_COLOR[alerta.gravidade] ?? Colors.primary;
  const ago = () => {
    const diff = Date.now() - new Date(alerta.createdAt).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Agora há pouco';
    if (h < 24) return `Há ${h}h`;
    return `Há ${Math.floor(h / 24)} dia${Math.floor(h / 24) > 1 ? 's' : ''}`;
  };

  return (
    <View style={[itemStyles.card, { borderLeftColor: color }]}>
      <View style={itemStyles.header}>
        <View style={[itemStyles.iconBox, { backgroundColor: `${color}18` }]}>
          <Text style={itemStyles.icon}>{TIPO_ICON[alerta.tipo] ?? '⚠️'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.tipo}>{TIPO_LABEL[alerta.tipo] ?? alerta.tipo}</Text>
            <View style={[itemStyles.nivelBadge, { backgroundColor: `${color}22`, borderColor: color }]}>
              <Text style={[itemStyles.nivelText, { color }]}>{alerta.gravidade.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={itemStyles.ago}>{ago()}</Text>
        </View>
      </View>
      <Text style={itemStyles.desc}>{alerta.mensagem}</Text>
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
  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 22 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  tipo: { fontSize: 14, fontWeight: '700', color: Colors.text },
  nivelBadge: { borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1 },
  nivelText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ago: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  desc: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 12 },
  actions: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },
  resolveBtn: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  resolveText: { fontSize: 12, fontWeight: '700' },
});

export default function AlertasScreen({ navigation }: any) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
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
          } catch { }
          setAlertas(prev => prev.filter(a => a.id !== id));
        },
      },
    ]);
  };

  const filtered = filtro === 'TODOS'
    ? alertas
    : alertas.filter(a => a.gravidade === filtro.toLowerCase());

  const altaCount = alertas.filter(a => a.gravidade === 'alta').length;

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Alertas"
        subtitle={alertas.length > 0 ? `${alertas.length} ativo${alertas.length > 1 ? 's' : ''}` : 'Tudo tranquilo'}
      />
      {altaCount > 0 && (
        <View style={styles.urgentBanner}>
          <Text style={styles.urgentText}>🚨 {altaCount} alerta{altaCount > 1 ? 's' : ''} de risco ALTO — ação necessária!</Text>
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
  safe: { flex: 1, backgroundColor: '#06111F' },
  urgentBanner: { marginHorizontal: 20, marginBottom: 12, backgroundColor: 'rgba(231,76,60,0.12)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E74C3C' },
  urgentText: { fontSize: 13, color: '#E74C3C', fontWeight: '600', textAlign: 'center' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
});