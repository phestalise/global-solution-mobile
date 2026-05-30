// src/screens/PropriedadesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, RefreshControl,
} from 'react-native';
import { Colors, Spacing, Radius } from '../styles/colors';
import { propriedadeService } from '../services/api';
import { Propriedade } from '../types';
import { EmptyState, LoadingOverlay, ScreenHeader } from '../components';

const MOCK: Propriedade[] = [
  { id: 1, nome: 'Fazenda São João',  localizacao: 'Ribeirão Preto, SP', cultura: 'Soja',  areaHectares: 320, produtorId: 1 },
  { id: 2, nome: 'Sítio Estrela',     localizacao: 'Londrina, PR',       cultura: 'Milho', areaHectares: 85,  produtorId: 1 },
  { id: 3, nome: 'Rancho Verde',      localizacao: 'Uberaba, MG',        cultura: 'Café',  areaHectares: 40,  produtorId: 1 },
];

const CULTURA_ICON: Record<string, string> = {
  Soja: '🌱', Milho: '🌽', Café: '☕', Arroz: '🍚', Cana: '🎋',
};

function PropCard({ item, onPress, onDelete }: { item: Propriedade; onPress: () => void; onDelete: () => void }) {
  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={cardStyles.header}>
        <View style={cardStyles.iconBox}>
          <Text style={cardStyles.icon}>{CULTURA_ICON[item.cultura] ?? '🌾'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.nome}>{item.nome}</Text>
          <Text style={cardStyles.loc}>📍 {item.localizacao}</Text>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          style={cardStyles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={cardStyles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
      <View style={cardStyles.footer}>
        <View style={cardStyles.pill}>
          <Text style={cardStyles.pillText}>{item.cultura}</Text>
        </View>
        <Text style={cardStyles.area}>{item.areaHectares} ha</Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card:       { backgroundColor: Colors.bgCard, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  header:     { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  iconBox:    { width: 42, height: 42, borderRadius: Radius.md, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  icon:       { fontSize: 20 },
  nome:       { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  loc:        { fontSize: 12, color: Colors.textSecondary, marginTop: 3 },
  deleteBtn:  { padding: 4 },
  deleteIcon: { fontSize: 16 },
  footer:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill:       { backgroundColor: Colors.bgSurface, borderRadius: Radius.lg, paddingHorizontal: 10, paddingVertical: 3 },
  pillText:   { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  area:       { fontSize: 13, color: Colors.textSecondary },
});

export default function PropriedadesScreen({ navigation }: any) {
  const [itens,      setItens]      = useState<Propriedade[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await propriedadeService.listar(1);
      setItens(res.data);
    } catch {
      setItens(MOCK);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = (item: Propriedade) => {
    Alert.alert(
      'Remover propriedade',
      `Deseja remover "${item.nome}"? Todas as leituras vinculadas também serão excluídas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await propriedadeService.deletar(item.id);
              setItens(prev => prev.filter(p => p.id !== item.id));
            } catch (err: any) {
              Alert.alert('Erro', err.message);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingOverlay />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Minhas Fazendas"
        subtitle={`${itens.length} propriedade${itens.length !== 1 ? 's' : ''} cadastrada${itens.length !== 1 ? 's' : ''}`}
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('FormPropriedade', { propriedade: undefined })}
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={itens}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            message="Nenhuma fazenda cadastrada ainda.\nToque em ＋ para adicionar."
            icon="🌾"
          />
        }
        renderItem={({ item }) => (
          <PropCard
            item={item}
            onPress={() => navigation.navigate('DetalhesPropriedade', { propriedadeId: item.id, nome: item.nome })}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  list:   { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  addBtn: {
    width: 38, height: 38, borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  addIcon: { fontSize: 20, color: Colors.bg, fontWeight: '700', marginTop: -1 },
});