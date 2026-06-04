import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Pressable, Modal,
  StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { propriedadeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CULTURA_ICON: Record<string, string> = {
  soja: '🌱', milho: '🌽', café: '☕', arroz: '🍚',
  cana: '🎋', trigo: '🌾', algodão: '🤍',
};

function getCulturaIcon(tipo?: string) {
  if (!tipo) return '🌾';
  return CULTURA_ICON[tipo.toLowerCase()] ?? '🌾';
}

function ConfirmModal({ visible, nomeFazenda, onConfirm, onCancel, loading }: {
  visible: boolean;
  nomeFazenda: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={modal.overlay}>
        <View style={modal.box}>
          <View style={modal.iconBox}>
            <Ionicons name="trash-outline" size={28} color="#F44336" />
          </View>
          <Text style={modal.title}>Remover Propriedade</Text>
          <Text style={modal.message}>
            {`Deseja remover "${nomeFazenda}"?\n\nTodas as leituras e alertas vinculados também serão excluídos.`}
          </Text>
          <View style={modal.buttons}>
            <TouchableOpacity style={modal.cancelBtn} onPress={onCancel} disabled={loading}>
              <Text style={modal.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modal.confirmBtn} onPress={onConfirm} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={modal.confirmText}>Remover</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SuccessModal({ visible, nomeFazenda, onClose }: {
  visible: boolean;
  nomeFazenda: string;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.box}>
          <View style={[modal.iconBox, { backgroundColor: 'rgba(0,245,160,0.1)' }]}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#00F5A0" />
          </View>
          <Text style={modal.title}>Removida!</Text>
          <Text style={modal.message}>{`"${nomeFazenda}" foi removida com sucesso.`}</Text>
          <TouchableOpacity style={[modal.confirmBtn, { backgroundColor: '#00F5A0' }]} onPress={onClose}>
            <Text style={[modal.confirmText, { color: '#000' }]}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function PropCard({ item, onPress, onDelete, deleting }: {
  item: any;
  onPress: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const cultura = item.culturas?.[0]?.tipoCultura ?? null;

  return (
    <View style={[styles.card, deleting && { opacity: 0.4 }]}>
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{getCulturaIcon(cultura)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{item.nomeFazenda}</Text>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={12} color="#4A6080" />
              <Text style={styles.loc}>{`${item.municipio}, ${item.estado}`}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
        </Pressable>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Ionicons name="resize-outline" size={13} color="#4A6080" />
          <Text style={styles.infoText}>{`${item.areaHectares} ha`}</Text>
        </View>
        {cultura ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{cultura}</Text>
          </View>
        ) : null}
        {item.totalCulturas > 0 ? (
          <View style={styles.pillSecondary}>
            <Text style={styles.pillSecondaryText}>{`${item.totalCulturas} cultura${item.totalCulturas > 1 ? 's' : ''}`}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default function PlantationScreen({ navigation }: any) {
  const { produtor } = useAuth();
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [confirmItem, setConfirmItem] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successItem, setSuccessItem] = useState<any | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!produtor?.id) return;
    if (!silent) setLoading(true);
    setErro(null);
    try {
      const res = await propriedadeService.listar(produtor.id);
      setItens(res.data);
    } catch (e: any) {
      setErro(e.message || 'Erro ao carregar propriedades.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [produtor?.id]);

  useEffect(() => { load(); }, [load]);

  const handleConfirmDelete = async () => {
    if (!confirmItem) return;
    setDeleting(true);
    try {
      await propriedadeService.deletar(confirmItem.id);
      setItens(prev => prev.filter(p => p.id !== confirmItem.id));
      setSuccessItem(confirmItem);
      setConfirmItem(null);
    } catch (e: any) {
      setConfirmItem(null);
      setErro(e.message || 'Erro ao remover.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando propriedades...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ConfirmModal
        visible={!!confirmItem}
        nomeFazenda={confirmItem?.nomeFazenda ?? ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmItem(null)}
        loading={deleting}
      />
      <SuccessModal
        visible={!!successItem}
        nomeFazenda={successItem?.nomeFazenda ?? ''}
        onClose={() => setSuccessItem(null)}
      />

      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Minhas Propriedades</Text>
          <Text style={styles.pageSubtitle}>
            {`${itens.length} propriedade${itens.length !== 1 ? 's' : ''} cadastrada${itens.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('NovaPropriedade', { propriedade: undefined })}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {erro ? (
        <View style={styles.erroBox}>
          <Ionicons name="warning-outline" size={16} color="#F44336" />
          <Text style={styles.erroText}>{erro}</Text>
          <TouchableOpacity onPress={() => { setErro(null); load(); }}>
            <Text style={styles.erroRetry}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={itens}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(true); }}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🌾</Text>
            <Text style={styles.emptyText}>Nenhuma propriedade cadastrada.</Text>
            <Text style={styles.emptySubtext}>Toque em + para adicionar sua primeira fazenda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PropCard
            item={item}
            deleting={confirmItem?.id === item.id && deleting}
            onPress={() => navigation.navigate('DetalhesPropriedade', { propriedadeId: item.id, nome: item.nomeFazenda })}
            onDelete={() => setConfirmItem(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const modal = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  box:        { backgroundColor: '#0D1B2A', borderRadius: 24, padding: 28, width: '100%', maxWidth: 360, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  iconBox:    { width: 60, height: 60, borderRadius: 18, backgroundColor: 'rgba(244,67,54,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title:      { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  message:    { color: '#7A8FA0', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  buttons:    { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn:  { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  cancelText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#F44336', alignItems: 'center' },
  confirmText:{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: '#060F1E' },
  centered:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:       { color: '#4A6080', marginTop: 12, fontSize: 14 },
  pageHeader:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  pageTitle:         { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  pageSubtitle:      { color: '#4A6080', fontSize: 13, marginTop: 3 },
  addBtn:            { width: 42, height: 42, borderRadius: 13, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  erroBox:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a0a0a', borderRadius: 12, padding: 12, marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F44336' },
  erroText:          { color: '#F44336', marginLeft: 8, fontSize: 13, flex: 1 },
  erroRetry:         { color: '#F44336', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  list:              { paddingHorizontal: 20, paddingBottom: 40 },
  card:              { backgroundColor: '#0D1B2A', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  cardHeader:        { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox:           { width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(0,245,160,0.08)', borderWidth: 1, borderColor: 'rgba(0,245,160,0.15)', justifyContent: 'center', alignItems: 'center' },
  icon:              { fontSize: 20 },
  nome:              { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  locRow:            { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  loc:               { fontSize: 12, color: '#4A6080' },
  deleteBtn:         { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(244,67,54,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  cardFooter:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoRow:           { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText:          { fontSize: 12, color: '#4A6080' },
  pill:              { backgroundColor: 'rgba(0,245,160,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(0,245,160,0.2)' },
  pillText:          { fontSize: 11, color: '#00F5A0', fontWeight: '600' },
  pillSecondary:     { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  pillSecondaryText: { fontSize: 11, color: '#4A6080' },
  empty:             { alignItems: 'center', paddingTop: 80 },
  emptyIcon:         { fontSize: 48, marginBottom: 16 },
  emptyText:         { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  emptySubtext:      { color: '#4A6080', fontSize: 13, marginTop: 6, textAlign: 'center' },
});