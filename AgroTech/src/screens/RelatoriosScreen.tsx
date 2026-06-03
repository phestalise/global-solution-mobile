import React, { useState, useCallback } from "react";
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { useAuth } from "../context/AuthContext";
import { leituraService, propriedadeService } from "../services/api";

export default function RelatoriosScreen() {
  const { produtor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [propriedades, setPropriedades] = useState<any[]>([]);
  const [leituras, setLeituras] = useState<Record<number, any[]>>({});
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    if (!produtor?.id) return;
    try {
      setErro(null);
      const propRes = await propriedadeService.listar(produtor.id);
      const props = propRes.data;
      setPropriedades(props);

      const leiturasMap: Record<number, any[]> = {};
      await Promise.all(
        props.map(async (p: any) => {
          try {
            const res = await leituraService.listar(p.id ?? p.Id, 5);
            leiturasMap[p.id ?? p.Id] = res.data;
          } catch {
            leiturasMap[p.id ?? p.Id] = [];
          }
        })
      );
      setLeituras(leiturasMap);
    } catch (e: any) {
      setErro(e.message || "Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [produtor?.id]);

  React.useEffect(() => { buscarDados(); }, [buscarDados]);

  const onRefresh = useCallback(() => { setRefreshing(true); buscarDados(); }, [buscarDados]);

  const calcRisco = (ndvi: number) => {
    if (ndvi >= 0.6) return { label: "BAIXO", cor: "#4CAF50" };
    if (ndvi >= 0.3) return { label: "MÉDIO", cor: "#FFC107" };
    return { label: "ALTO", cor: "#F44336" };
  };

  if (loading) {
    return (
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Carregando relatórios...</Text>
      </LinearGradient>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />}
    >
      <LinearGradient colors={["#06111F", "#081B33", "#0A223D"]} style={styles.background}>

        <Text style={styles.pageTitle}>Relatórios</Text>
        <Text style={styles.pageSubtitle}>Histórico de leituras por propriedade</Text>

        {erro && (
          <View style={styles.erroBox}>
            <Ionicons name="warning-outline" size={18} color="#F44336" />
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        )}

        {propriedades.length === 0 && !erro && (
          <View style={styles.semDados}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.semDadosText}>Nenhuma propriedade cadastrada.</Text>
          </View>
        )}

        {propriedades.map((prop) => {
          const id = prop.id ?? prop.Id;
          const nome = prop.nomeFazenda ?? prop.NomeFazenda ?? "Propriedade";
          const lista = leituras[id] ?? [];

          return (
            <View key={id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="leaf" size={20} color={Colors.primary} />
                <Text style={styles.cardTitle}>{nome}</Text>
              </View>

              {lista.length === 0 ? (
                <Text style={styles.semLeitura}>Sem leituras registradas.</Text>
              ) : (
                <>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, styles.tableHead]}>Data</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>NDVI</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>Temp.</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>Umid.</Text>
                    <Text style={[styles.tableCell, styles.tableHead]}>Risco</Text>
                  </View>
                  {lista.map((l: any, i: number) => {
                    const risco = calcRisco(l.ndvi ?? l.Ndvi ?? 0);
                    const data = new Date(l.dataLeitura ?? l.DtLeitura).toLocaleDateString("pt-BR");
                    return (
                      <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                        <Text style={styles.tableCell}>{data}</Text>
                        <Text style={styles.tableCell}>{(l.ndvi ?? l.Ndvi ?? 0).toFixed(2)}</Text>
                        <Text style={styles.tableCell}>{(l.temperatura ?? l.Temperatura ?? 0).toFixed(1)}°</Text>
                        <Text style={styles.tableCell}>{(l.umidade ?? l.Umidade ?? 0).toFixed(0)}%</Text>
                        <Text style={[styles.tableCell, { color: risco.cor, fontWeight: "700" }]}>{risco.label}</Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          );
        })}
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#06111F" },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  background: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: Colors.textMuted, marginTop: 12, fontSize: 15 },
  pageTitle: { color: Colors.text, fontSize: 28, fontWeight: "900", marginBottom: 4 },
  pageSubtitle: { color: Colors.textMuted, fontSize: 14, marginBottom: 24 },
  erroBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#1a0a0a", borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#F44336" },
  erroText: { color: "#F44336", marginLeft: 8, fontSize: 14, flex: 1 },
  semDados: { alignItems: "center", paddingVertical: 60 },
  semDadosText: { color: Colors.textMuted, fontSize: 15, marginTop: 16 },
  card: { backgroundColor: Colors.card, borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  cardTitle: { color: Colors.text, fontSize: 16, fontWeight: "700", marginLeft: 8 },
  semLeitura: { color: Colors.textMuted, fontSize: 14, textAlign: "center", paddingVertical: 12 },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 8, marginBottom: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 8 },
  tableRowAlt: { backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 8 },
  tableCell: { flex: 1, color: Colors.textMuted, fontSize: 12, textAlign: "center" },
  tableHead: { color: Colors.text, fontWeight: "700", fontSize: 12 },
});