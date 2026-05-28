// src/screens/DetalhesPropriedadeScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { leituraService, alertaService } from '../services/api';
import { LeituraSatelital, Alerta } from '../types';
import { RiscoIndicator, StatCard, ScreenHeader, LoadingOverlay } from '../components';

// ── Mock ──────────────────────────────────────────────────────────────────────
const genMockLeituras = (propId: number): LeituraSatelital[] =>
  Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    propriedadeId: propId,
    ndvi:        parseFloat((0.4 + Math.random() * 0.45).toFixed(2)),
    temperatura: Math.round(24 + Math.random() * 12),
    umidade:     Math.round(40 + Math.random() * 40),
    dataLeitura: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));

const genMockAlertas = (propId: number): Alerta[] => [
  { id: 1, propriedadeId: propId, tipo: 'NDVI_BAIXO', descricao: 'NDVI abaixo de 0.3 detectado na área norte.', nivel: 'ALTO', ativo: true, createdAt: new Date().toISOString() },
  { id: 2, propriedadeId: propId, tipo: 'SECA',       descricao: 'Umidade do solo abaixo de 35% há 3 dias.',  nivel: 'MEDIO', ativo: true, createdAt: new Date(Date.now() - 86_400_000).toISOString() },
];

// ── Gráfico de barras simples ─────────────────────────────────────────────────
function MiniBarChart({ data, label, unit, color }: { data: number[]; label: string; unit: string; color: string }) {
  const max  = Math.max(...data, 1);
  const min  = Math.min(...data);
  return (
    <View style={chartStyles.container}>
      <Text style={chartStyles.title}>{label}</Text>
      <View style={chartStyles.bars}>
        {data.map((v, i) => (
          <View key={i} style={chartStyles.barWrap}>
            <Text style={chartStyles.barVal}>{v}{unit}</Text>
            <View style={[chartStyles.bar, { height: 60 * (v - min) / (max - min + 1) + 8, backgroundColor: color }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  title:     { fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: '600', letterSpacing: 0.5 },
  bars:      { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 80 },
  barWrap:   { alignItems: 'center', flex: 1, gap: 4 },
  barVal:    { fontSize: 9, color: Colors.textMuted },
  bar:       { width: '60%', borderRadius: 3, minHeight: 8 },
});

// ── Alerta card ───────────────────────────────────────────────────────────────
function AlertaCard({ alerta, onResolve }: { alerta: Alerta; onResolve: () => void }) {
  const colors: Record<string, string> = { ALTO: Colors.accentRed, MEDIO: Colors.accent, BAIXO: Colors.primary };
  const icons:  Record<string, string> = { NDVI_BAIXO: '🌿', SECA: '🔥', PRAGA: '🐛', EXCESSO_CHUVA: '🌊' };
  const c = colors[alerta.nivel] ?? Colors.primary;
  return (
    <View style={[alertCardStyles.card, { borderLeftColor: c }]}>
      <View style={alertCardStyles.row}>
        <Text style={alertCardStyles.icon}>{icons[alerta.tipo] ?? '⚠️'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={alertCardStyles.desc}>{alerta.descricao}</Text>
          <Text style={alertCardStyles.date}>{new Date(alerta.createdAt).toLocaleDateString('pt-BR')}</Text>
        </View>
        <TouchableOpacity onPress={onResolve} style={[alertCardStyles.resolveBtn, { borderColor: c }]}>
          <Text style={[alertCardStyles.resolveText, { color: c }]}>Resolver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const alertCardStyles = StyleSheet.create({
  card:        { backgroundColor: Colors.bgCard, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.border },
  row:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  icon:        { fontSize: 20 },
  desc:        { fontSize: 13, color: Colors.textPrimary, lineHeight: 18, flex: 1 },
  date:        { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  resolveBtn:  { borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  resolveText: { fontSize: 11, fontWeight: '700' },
});

// ── Tela principal ────────────────────────────────────────────────────────────
export default function DetalhesPropriedadeScreen({ route, navigation }: any) {
  const { propriedadeId, nome } = route.params as { propriedadeId: number; nome: string };

  const [leituras,   setLeituras]   = useState<LeituraSatelital[]>([]);
  const [alertas,    setAlertas]    = useState<Alerta[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [lRes, aRes] = await Promise.all([
        leituraService.listar(propriedadeId, 7),
        alertaService.listar(1),                // ⚠️  substituir pelo id do produtor
      ]);
      setLeituras(lRes.data);
      setAlertas(aRes.data.filter(a => a.propriedadeId === propriedadeId));
    } catch {
      setLeituras(genMockLeituras(propriedadeId));
      setAlertas(genMockAlertas(propriedadeId));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [propriedadeId]);

  useEffect(() => { load(); }, [load]);

  const ultima = leituras[0];

  // Calcular risco da última leitura
  let risco = 'BAIXO';
  if (ultima) {
    if (ultima.ndvi < 0.3 || ultima.umidade < 35) risco = 'ALTO';
    else if (ultima.ndvi < 0.5 || ultima.temperatura > 34) risco = 'MÉDIO';
  }

  const handleResolve = async (id: number) => {
    try {
      await alertaService.resolver(id);
      setAlertas(prev => prev.filter(a => a.id !== id));
    } catch {
      setAlertas(prev => prev.filter(a => a.id !== id)); // otimista
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title={nome}
        subtitle="Dados satelitais em tempo real"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('FormPropriedade', { propriedade: { id: propriedadeId, nome } })}
          >
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={Colors.primary} />}
      >
        {/* ── Risco badge ── */}
        <View style={styles.riscoBanner}>
          <Text style={styles.riscoLabel}>Nível de Risco Atual</Text>
          <RiscoIndicator nivel={risco} size="lg" />
        </View>

        {/* ── Última leitura ── */}
        {ultima && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Última Leitura Satelital</Text>
            <View style={styles.statsGrid}>
              <StatCard label="NDVI"          value={ultima.ndvi.toFixed(2)}  accentColor={Colors.primary}    style={styles.statItem} />
              <StatCard label="Temperatura"   value={ultima.temperatura}      unit="°C" accentColor={Colors.accent}    style={styles.statItem} />
              <StatCard label="Umidade"        value={ultima.umidade}          unit="%"  accentColor={Colors.accentBlue} style={styles.statItem} />
            </View>
          </View>
        )}

        {/* ── Histórico gráficos ── */}
        {leituras.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evolução (7 dias)</Text>
            <MiniBarChart
              data={leituras.map(l => l.ndvi).reverse()}
              label="NDVI"
              unit=""
              color={Colors.primary}
            />
            <MiniBarChart
              data={leituras.map(l => l.temperatura).reverse()}
              label="TEMPERATURA (°C)"
              unit="°"
              color={Colors.accent}
            />
            <MiniBarChart
              data={leituras.map(l => l.umidade).reverse()}
              label="UMIDADE (%)"
              unit="%"
              color={Colors.accentBlue}
            />
          </View>
        )}

        {/* ── Alertas ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Ativos ({alertas.length})</Text>
          {alertas.length === 0
            ? <View style={styles.noAlert}><Text style={styles.noAlertText}>✅ Nenhum alerta ativo. Lavoura saudável!</Text></View>
            : alertas.map(a => <AlertaCard key={a.id} alerta={a} onResolve={() => handleResolve(a.id)} />)
          }
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.bg },
  editBtn:    { backgroundColor: Colors.bgSurface, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  editText:   { fontSize: 13, color: Colors.textSecondary },

  riscoBanner: { marginHorizontal: Spacing.lg, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  riscoLabel:  { fontSize: 13, color: Colors.textSecondary },

  section:      { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  statsGrid:    { flexDirection: 'row', gap: 8 },
  statItem:     { flex: 1 },

  noAlert:     { backgroundColor: Colors.bgCard, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  noAlertText: { color: Colors.primary, fontSize: 14, textAlign: 'center' },
});