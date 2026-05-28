// src/screens/DashboardScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, Alert,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { leituraService } from '../services/api';
import { RiscoIndicator, StatCard, LoadingOverlay, EmptyState } from '../components';

// ── Tipos locais ──────────────────────────────────────────────────────────────
interface DashItem {
  propriedadeId: number;
  nome: string;
  leitura: {
    ndvi: number;
    temperatura: number;
    umidade: number;
    dataLeitura: string;
  };
  risco: string;
}

// ── Mock data (usado enquanto a API não está pronta) ──────────────────────────
const MOCK_DATA: DashItem[] = [
  {
    propriedadeId: 1, nome: 'Fazenda São João',
    leitura: { ndvi: 0.72, temperatura: 28, umidade: 65, dataLeitura: new Date().toISOString() },
    risco: 'BAIXO',
  },
  {
    propriedadeId: 2, nome: 'Sítio Estrela',
    leitura: { ndvi: 0.31, temperatura: 34, umidade: 42, dataLeitura: new Date().toISOString() },
    risco: 'ALTO',
  },
  {
    propriedadeId: 3, nome: 'Rancho Verde',
    leitura: { ndvi: 0.51, temperatura: 30, umidade: 55, dataLeitura: new Date().toISOString() },
    risco: 'MÉDIO',
  },
];

function calcRiscoColor(nivel: string) {
  if (nivel === 'ALTO')  return Colors.statusHigh;
  if (nivel === 'MÉDIO' || nivel === 'MEDIO') return Colors.statusMedium;
  return Colors.statusLow;
}

function NdviBar({ value }: { value: number }) {
  const pct   = Math.max(0, Math.min(1, value)) * 100;
  const color = value < 0.3 ? Colors.accentRed : value < 0.5 ? Colors.accent : Colors.primary;
  return (
    <View style={ndviStyles.track}>
      <View style={[ndviStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      <Text style={ndviStyles.label}>{value.toFixed(2)}</Text>
    </View>
  );
}

const ndviStyles = StyleSheet.create({
  track: { backgroundColor: Colors.bgSurface, borderRadius: 4, height: 8, overflow: 'hidden', position: 'relative', marginTop: 4 },
  fill:  { height: '100%', borderRadius: 4 },
  label: { position: 'absolute', right: 4, top: -16, fontSize: 10, color: Colors.textSecondary },
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }: any) {
  const [data,       setData]       = useState<DashItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // ⚠️  Substitua 1 pelo id do produtor logado (salvo após login)
      const res = await leituraService.getDashboard(1);
      setData(res.data);
    } catch {
      // Fallback para mock enquanto a API não está pronta
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(true); };

  if (loading) return <LoadingOverlay />;

  // ── Resumo geral ──────────────────────────────────────────────────────────
  const totalAlto   = data.filter(d => d.risco === 'ALTO').length;
  const totalMedio  = data.filter(d => d.risco === 'MÉDIO' || d.risco === 'MEDIO').length;
  const mediaTemp   = data.length ? (data.reduce((a, b) => a + b.leitura.temperatura, 0) / data.length).toFixed(1) : '—';
  const mediaNDVI   = data.length ? (data.reduce((a, b) => a + b.leitura.ndvi, 0) / data.length).toFixed(2) : '—';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bom dia, Produtor 🌤️</Text>
            <Text style={styles.subtitle}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</Text>
          </View>
          <View style={styles.satBadge}>
            <Text style={styles.satDot}>●</Text>
            <Text style={styles.satText}>Satélite ativo</Text>
          </View>
        </View>

        {/* ── Resumo stats ── */}
        <View style={styles.statsRow}>
          <StatCard label="Propriedades" value={data.length}        accentColor={Colors.accentBlue} style={{ marginRight: 6 }} />
          <StatCard label="Risco ALTO"   value={totalAlto}          accentColor={Colors.accentRed}  style={{ marginHorizontal: 3 }} />
          <StatCard label="NDVI Médio"   value={mediaNDVI}          accentColor={Colors.primary}    style={{ marginLeft: 6 }} />
        </View>

        {/* ── Temperatura média ── */}
        <View style={styles.tempCard}>
          <View style={styles.tempLeft}>
            <Text style={styles.tempIcon}>🌡️</Text>
            <View>
              <Text style={styles.tempLabel}>Temp. Média nas Propriedades</Text>
              <Text style={styles.tempValue}>{mediaTemp} °C</Text>
            </View>
          </View>
          {totalAlto > 0 && (
            <View style={styles.alertPill}>
              <Text style={styles.alertPillText}>⚠ {totalAlto} alerta{totalAlto > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* ── Lista de propriedades ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Propriedades</Text>
          {data.length === 0
            ? <EmptyState message="Nenhuma propriedade cadastrada. Adicione na aba Fazendas." icon="🌾" />
            : data.map(item => (
                <TouchableOpacity
                  key={item.propriedadeId}
                  style={[styles.propCard, { borderLeftColor: calcRiscoColor(item.risco) }]}
                  onPress={() => navigation.navigate('Propriedades', {
                    screen: 'DetalhesPropriedade',
                    params: { propriedadeId: item.propriedadeId, nome: item.nome },
                  })}
                  activeOpacity={0.8}
                >
                  <View style={styles.propHeader}>
                    <Text style={styles.propNome}>{item.nome}</Text>
                    <RiscoIndicator nivel={item.risco} />
                  </View>

                  {/* NDVI bar */}
                  <View style={styles.ndviRow}>
                    <Text style={styles.ndviLabel}>NDVI</Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <NdviBar value={item.leitura.ndvi} />
                    </View>
                  </View>

                  <View style={styles.propStats}>
                    <Text style={styles.propStat}>🌡 {item.leitura.temperatura}°C</Text>
                    <Text style={styles.propStat}>💧 {item.leitura.umidade}%</Text>
                    <Text style={styles.propDate}>
                      {new Date(item.leitura.dataLeitura).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          }
        </View>

        {/* ── Legenda risco ── */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Nível de Risco da Lavoura</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.statusLow }]} />
              <Text style={styles.legendLabel}>BAIXO — NDVI {'>'} 0.5, condições normais</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.statusMedium }]} />
              <Text style={styles.legendLabel}>MÉDIO — NDVI 0.3–0.5 ou temp alta</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.statusHigh }]} />
              <Text style={styles.legendLabel}>ALTO — NDVI {'<'} 0.3 ou seca detectada</Text>
            </View>
          </View>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  greeting:    { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  subtitle:    { fontSize: 12, color: Colors.textSecondary, marginTop: 4, textTransform: 'capitalize' },
  satBadge:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.border, gap: 5 },
  satDot:      { fontSize: 8, color: Colors.primary },
  satText:     { fontSize: 11, color: Colors.textSecondary },

  statsRow:    { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },

  tempCard:    { marginHorizontal: Spacing.lg, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  tempLeft:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  tempIcon:    { fontSize: 24 },
  tempLabel:   { fontSize: 11, color: Colors.textSecondary },
  tempValue:   { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  alertPill:   { backgroundColor: 'rgba(231,76,60,0.15)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.accentRed },
  alertPillText: { fontSize: 12, color: Colors.accentRed, fontWeight: '600' },

  section:      { paddingHorizontal: Spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  propCard:    { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 4 },
  propHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  propNome:    { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  ndviRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  ndviLabel:   { fontSize: 11, color: Colors.textMuted, width: 34 },
  propStats:   { flexDirection: 'row', gap: Spacing.md, marginTop: 4 },
  propStat:    { fontSize: 13, color: Colors.textSecondary },
  propDate:    { fontSize: 11, color: Colors.textMuted, marginLeft: 'auto' },

  legend:       { marginHorizontal: Spacing.lg, marginTop: Spacing.md, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  legendTitle:  { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm, letterSpacing: 0.5 },
  legendRow:    { gap: 6 },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendLabel:  { fontSize: 11, color: Colors.textMuted, flex: 1 },
});