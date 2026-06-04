
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Colors } from '../styles/colors';
import { alertaService } from '../services/api';
import { Alerta } from '../types';
import { ScreenHeader, LoadingOverlay, EmptyState } from '../components';
import { useAuth } from '../context/AuthContext';


const TIPO_ICON: Record<string, string> = {
  praga: '🐛',
  clima: '🌊',
  seca: '🔥',
  ndvi_baixo: '🌿',
};
const TIPO_LABEL: Record<string, string> = {
  praga: 'Praga',
  clima: 'Clima',
  seca: 'Seca',
  ndvi_baixo: 'NDVI Baixo',
};
const GRAVIDADE_COLOR: Record<string, string> = {
  alta: '#E74C3C',
  média: '#F39C12',
  baixa: '#2ECC71',
};

type Filtro = 'TODOS' | 'ALTA' | 'MÉDIA' | 'BAIXA';

// --------------------------------------------------
// Componente: Filtros em chips
// --------------------------------------------------
function FilterChips({
  active,
  onChange,
}: {
  active: Filtro;
  onChange: (f: Filtro) => void;
}) {
  const opts: { key: Filtro; label: string; color: string }[] = [
    { key: 'TODOS', label: 'Todos', color: '#7E8A97' },
    { key: 'ALTA', label: '🔴 Alta', color: '#E74C3C' },
    { key: 'MÉDIA', label: '🟡 Média', color: '#F39C12' },
    { key: 'BAIXA', label: '🟢 Baixa', color: '#2ECC71' },
  ];

  return (
    <View style={filterStyles.row}>
      {opts.map((o) => (
        <TouchableOpacity
          key={o.key}
          style={[
            filterStyles.chip,
            active === o.key && {
              borderColor: o.color,
              backgroundColor: `${o.color}18`,
            },
          ]}
          onPress={() => onChange(o.key)}
        >
          <Text
            style={[
              filterStyles.chipText,
              active === o.key && { color: o.color, fontWeight: '700' },
            ]}
          >
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const filterStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipText: { fontSize: 12, color: Colors.textMuted },
});

// --------------------------------------------------
// Componente: Item de alerta
// --------------------------------------------------
function AlertaItem({
  alerta,
  onResolve,
}: {
  alerta: Alerta;
  onResolve: (id: number) => void;
}) {
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
          <Text style={itemStyles.icon}>
            {TIPO_ICON[alerta.tipo] ?? '⚠️'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.tipo}>
              {TIPO_LABEL[alerta.tipo] ?? alerta.tipo}
            </Text>
            <View
              style={[
                itemStyles.nivelBadge,
                { backgroundColor: `${color}22`, borderColor: color },
              ]}
            >
              <Text style={[itemStyles.nivelText, { color }]}>
                {alerta.gravidade.toUpperCase()}
              </Text>
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
          <Text style={[itemStyles.resolveText, { color }]}>
            ✓ Marcar como resolvido
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 22 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  tipo: { fontSize: 14, fontWeight: '700', color: Colors.text },
  nivelBadge: {
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  nivelText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  ago: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  desc: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 19,
    marginBottom: 12,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  resolveBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  resolveText: { fontSize: 12, fontWeight: '700' },
});

// --------------------------------------------------
// Tela principal: AlertasScreen
// --------------------------------------------------
export default function AlertasScreen() {
  const { user } = useAuth(); // ← Agora user existe (alias de produtor no contexto)
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  // Carregar alertas com o id real do produtor logado
  const load = useCallback(
    async (silent = false) => {
      if (!user?.id) return; // sem usuário, não faz nada

      if (!silent) setLoading(true);
      try {
        const res = await alertaService.listar(user.id);
        setAlertas(res.data);
        setErro('');
      } catch (err) {
        setAlertas([]);
        setErro('Não foi possível carregar os alertas. Verifique sua conexão.');
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Resolver alerta
  const handleResolve = (id: number) => {
    Alert.alert('Resolver alerta', 'Confirma que este alerta foi tratado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {
            await alertaService.resolver(id);
            setAlertas((prev) => prev.filter((a) => a.id !== id));
          } catch {
            Alert.alert('Erro', 'Não foi possível resolver o alerta.');
          }
        },
      },
    ]);
  };

  // Filtragem
  const filtered =
    filtro === 'TODOS'
      ? alertas
      : alertas.filter((a) => a.gravidade === filtro.toLowerCase());

  const altaCount = alertas.filter((a) => a.gravidade === 'alta').length;

  // Exibe loading overlay enquanto carrega
  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Alertas"
        subtitle={
          alertas.length > 0
            ? `${alertas.length} ativo${alertas.length > 1 ? 's' : ''}`
            : 'Tudo tranquilo'
        }
      />

      {erro ? (
        // Banner de erro com opção de tentar novamente
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{erro}</Text>
          <TouchableOpacity onPress={() => load()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Alerta urgente */}
          {altaCount > 0 && (
            <View style={styles.urgentBanner}>
              <Text style={styles.urgentText}>
                🚨 {altaCount} alerta{altaCount > 1 ? 's' : ''} de risco ALTO —
                ação necessária!
              </Text>
            </View>
          )}

          {/* Filtros */}
          <FilterChips active={filtro} onChange={setFiltro} />
        </>
      )}

      {/* Lista de alertas */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load(true);
            }}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            message={
              filtro === 'TODOS'
                ? 'Nenhum alerta ativo. Sua lavoura está bem! 🌱'
                : `Sem alertas de nível ${filtro}.`
            }
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

// --------------------------------------------------
// Estilos da tela
// --------------------------------------------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#06111F' },
  urgentBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(231,76,60,0.12)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  urgentText: {
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBanner: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: 'rgba(231,76,60,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
    alignItems: 'center',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: { color: '#FFD966', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
});